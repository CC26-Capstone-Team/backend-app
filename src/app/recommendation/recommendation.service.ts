import { GoogleGenAI } from "@google/genai";
import { getJson } from "serpapi";
import { AppError } from "../../lib/error.js";
import { prisma } from "../../lib/prisma.js";
import type { AIRecommendationResult } from "./recommendation.types.js";
import { AIJobResponseSchema, AIResponseSchema } from "./recommendation.schema.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function userRecommendations(userId: string) {
  const recommendationSession = await prisma.recommendation_session.findMany({
    where: { user_id: userId },
    include: {
      recommendation_history: {
        include: {
          career: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return recommendationSession.map(({ recommendation_history, ...session }) => ({
    ...session,
    recommendation_history,
  }));
}

export async function latestUserRecommendation(userId: string) {
  // 1. Pengambilan data (Query Prisma tetap sama)
  const data = await prisma.recommendation_session.findFirst({
    where: { user_id: userId },
    include: {
      recommendation_history: {
        include: {
          career: {
            include: {
              career_skills: {
                include: {
                  skill: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  if (!data) {
    throw new AppError(404, "No recommendation found");
  }

  // 2. Pisahkan recommendation_history dari data session
  const { recommendation_history, ...session } = data;

  // 3. Petakan (map) history untuk meratakan struktur datanya
  const formattedHistory = recommendation_history.map((history) => {
    // Destructure untuk mengambil career_skills agar bisa dikeluarkan dari objek utama
    const { career_skills, ...restCareer } = history.career;

    return {
      ...history,
      career: {
        ...restCareer,
        // Buat key baru bernama 'skills' yang isinya list id & name
        skills: career_skills.map((cs) => ({
          id: cs.skill.id,
          name: cs.skill.name,
        })),
      },
    };
  });

  // 4. Gabungkan kembali session dengan history yang sudah diformat
  return {
    ...session,
    recommendation_history: formattedHistory,
  };
}

export async function userRecommendationBySessionId(sessionId: string) {
  const data = await prisma.recommendation_session.findUnique({
    where: { id: sessionId },
    include: {
      recommendation_history: {
        include: {
          career: true,
        },
      },
    },
  });

  if (!data) {
    throw new AppError(404, "Recommendation not found");
  }

  const { recommendation_history, ...session } = data;

  return {
    ...session,
    recommendation_history,
  };
}

export async function generateCourseRecommendation(userId: string, targetCareer: string) {
  const careerId = await prisma.career.findUnique({
    where: { title: targetCareer },
    select: { id: true },
  });

  if (!careerId) {
    throw new AppError(404, "Career not found");
  }

  const existingRecommendation = await prisma.course_recommendation.findFirst({
    where: {
      user_id: userId,
      career_id: careerId.id,
    },
    include: {
      courses: true,
    },
    orderBy: { created_at: "desc" },
  });

  if (existingRecommendation) {
    return existingRecommendation;
  }

  const existingSkills = await prisma.user_skill.findMany({
    where: { user_id: userId },
    select: { skill: true },
  });

  const currentSkills = existingSkills.map((us) => us.skill.name);

  if (currentSkills.length === 0) {
    currentSkills.push("belum memiliki skill spesifik (membutuhkan materi dari dasar)");
  }

  const prompt = `Saya menguasai ${currentSkills.join(", ")}. Berikan 3 rekomendasi topik lanjutan dan kursusnya untuk berkarir sebagai ${targetCareer}.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: AIResponseSchema,
      temperature: 0.1,
    },
  });

  const parsedData = JSON.parse(response.text as string) as AIRecommendationResult;

  const savedRecommendation = await prisma.course_recommendation.create({
    data: {
      user_id: userId,
      career_id: careerId.id,
      analysis: parsedData.analysis,
      courses: {
        create: parsedData.courses.map((course) => ({
          topic: course.topic,
          platform: course.platform,
          reason: course.reason,
          level: course.level,
        })),
      },
    },
    include: {
      courses: true,
      career: true,
    },
  });

  return savedRecommendation;
}

async function fetchJobsFromSerpApi(targetCareer: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    getJson(
      {
        engine: "google_jobs",
        q: `${targetCareer} in Indonesia`,
        hl: "id",
        gl: "id",
        api_key: process.env.SERPAPI_API_KEY,
      },
      (json: any) => {
        if (json.error) {
          if (json.error.includes("Google hasn't returned any results")) {
            resolve([]);
          } else {
            reject(new Error(json.error));
          }
        } else if (json.jobs_results) {
          resolve(json.jobs_results.slice(0, 5));
        } else {
          resolve([]);
        }
      }
    );
  });
}

export async function generateJobRecommendation(userId: string, targetCareer: string) {
  const careerData = await prisma.career.findUnique({
    where: { title: targetCareer },
    select: { id: true },
  });

  if (!careerData) {
    throw new AppError(404, "Career not found");
  }

  const existingJobRec = await prisma.job_recommendation.findFirst({
    where: {
      user_id: userId,
      career_id: careerData.id,
    },
    include: { jobs: true },
  });

  if (existingJobRec) {
    const now = new Date();
    const lastFeched = new Date(existingJobRec.last_fetched_at);
    const diffInDays = (now.getTime() - lastFeched.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays < 2) {
      return {
        source: "cache",
        ...existingJobRec,
      };
    }
  }

  const rawJobs = await fetchJobsFromSerpApi(targetCareer);

  if (rawJobs.length === 0) {
    throw new AppError(
      404,
      "Maaf, belum ada lowongan kerja baru yang ditemukan di SerpAPI saat ini."
    );
  }

  const jobsDataForAI = rawJobs.map((job) => ({
    title: job.title,
    company_name: job.company_name,
    location: job.location,
    via: job.via,
    description: job.description?.substring(0, 500),
    apply_link: job.apply_options?.[0]?.link || "",
    posted_at: job.detected_extensions?.posted_at || null,
  }));

  const existingSkills = await prisma.user_skill.findMany({
    where: { user_id: userId },
    select: { skill: true },
  });

  const currentSkills =
    existingSkills.length > 0
      ? existingSkills.map((us) => us.skill.name).join(", ")
      : "belum memiliki skill spesifik";

  const prompt = `
  Saya memiliki skill: ${currentSkills}. Target karir saya: ${targetCareer}.
  Berikut adalah daftar pekerjaan dari Google Jobs:
  ${JSON.stringify(jobsDataForAI)}
  
  Tugas:
  1. Berikan analisis singkat tentang kecocokan profil saya dengan pasar kerja ini.
  2. Hitung 'match_score' (1-100) untuk setiap pekerjaan berdasarkan skill saya.
  3. Berikan 'match_reason' singkat untuk tiap pekerjaan (mengapa saya cocok atau skill apa yang kurang).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: AIJobResponseSchema, // Gunakan schema baru
      temperature: 0.1,
    },
  });

  const parsedData = JSON.parse(response.text as string);

  let savedRecommendation;

  if (existingJobRec) {
    savedRecommendation = await prisma.job_recommendation.update({
      where: { id: existingJobRec.id },
      data: {
        analysis: parsedData.analysis,
        last_fetched_at: new Date(), // Reset timer 2 hari
        jobs: {
          deleteMany: {}, // Hapus lowongan lama
          create: parsedData.jobs.map((job: any, index: number) => ({
            title: job.title,
            company_name: job.company_name,
            location: job.location,
            via: job.via,
            description: jobsDataForAI[index]?.description, // Kembalikan deskripsi asli dari SerpApi
            apply_link: jobsDataForAI[index]?.apply_link, // Kembalikan link asli
            posted_at: jobsDataForAI[index]?.posted_at,
            match_score: job.match_score,
            match_reason: job.match_reason,
          })),
        },
      },
      include: { jobs: true },
    });
  } else {
    savedRecommendation = await prisma.job_recommendation.create({
      data: {
        user_id: userId,
        career_id: careerData.id,
        analysis: parsedData.analysis,
        jobs: {
          create: parsedData.jobs.map((job: any, index: number) => ({
            title: job.title,
            company_name: job.company_name,
            location: job.location,
            via: job.via,
            description: jobsDataForAI[index]?.description,
            apply_link: jobsDataForAI[index]?.apply_link,
            match_score: job.match_score,
            match_reason: job.match_reason,
          })),
        },
      },
      include: { jobs: true },
    });
  }

  return {
    source: "api_refresh",
    ...savedRecommendation,
  };
}
