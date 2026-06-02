import { AppError } from "../../lib/error.js";
import { prisma } from "../../lib/prisma.js";
// Import metadata JSON dihapus karena kita tidak butuh memetakan index array lagi!
import type { MLPredictionItem, MLPredictionResponse } from "./prediction.types.js";

export async function generateAndSavePrediction(userId: string) {
  // 1. Ambil data user
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      skills: { include: { skill: true } },
    },
  });

  if (!userData || !userData.profile) {
    throw new AppError(404, "User profile not found. Please complete onboarding.");
  }

  const userProfile = userData.profile;
  const userSkillNames = userData.skills.map((us) => us.skill.name);

  // 2. Susun Payload baru sesuai standar ML yang baru
  const mlPayload = {
    education_required: userProfile.education_level,
    edu_bg: [userProfile.major], // Jadikan array sesuai format baru
    skills: userSkillNames,
    gpa: userProfile.gpa ? Number(userProfile.gpa) : 0.0,
    top_k: 5 // Tetap gunakan 5 agar Dashboard bisa merender 5 kartu
  };

  // 3. Panggil API ML
  const mlApiUrl = process.env.ML_API_URL || "http://localhost:5000/predict";
  const mlResponse = await fetch(mlApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mlPayload), // Gunakan payload baru
  });

  if (!mlResponse.ok) throw new Error("ML API Request Failed");

  // Cast JSON response ke interface
  const mlData = (await mlResponse.json()) as MLPredictionResponse;
  const topPredictions = mlData.top_k || [];

  const predictedCareerTitles = topPredictions.map((item: MLPredictionItem) => item.job_title);

  // 4. Cari ID Karir di Database
  const careersInDb = await prisma.career.findMany({
    where: { title: { in: predictedCareerTitles } },
  });

  if (careersInDb.length === 0) {
    throw new AppError(500, "Failed to map ML predictions to database careers.");
  }

  const careerMap = new Map(careersInDb.map((c) => [c.title, c.id]));

  // 5. Simpan ke database
  const newSession = await prisma.recommendation_session.create({
    data: {
      user_id: userId,
      recommendation_history: {
        create: topPredictions
          .map((prediction: MLPredictionItem) => {
            const dbCareerId = careerMap.get(prediction.job_title);

            if (!dbCareerId) return null;

            const score = prediction.probability
              ? parseFloat((prediction.probability * 100).toFixed(2))
              : null;

            return {
              career_id: dbCareerId,
              match_score: score,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null),
      },
    },
  });

  return newSession;
}

export async function reAnalyzeAndSavePrediction(userId: string, newSkillIds: string[]) {
  // 1. Validasi apakah skill_ids yang dikirim dari FE terdaftar di DB
  const validSkills = await prisma.skill.findMany({
    where: { id: { in: newSkillIds } },
  });

  if (validSkills.length !== newSkillIds.length) {
    throw new AppError(400, "One or more skills are invalid");
  }

  // 2. Update data skill user di DB menggunakan Transaction
  await prisma.$transaction([
    prisma.user_skill.deleteMany({
      where: { user_id: userId },
    }),
    prisma.user_skill.createMany({
      data: newSkillIds.map((skill_id) => ({ user_id: userId, skill_id })),
    }),
  ]);

  // 3. Ambil data profil pendidikan user yang sudah ada
  const userProfile = await prisma.user_profile.findUnique({
    where: { user_id: userId },
  });

  if (!userProfile) {
    throw new AppError(404, "User profile not found. Please complete onboarding first.");
  }

  const userSkillNames = validSkills.map((s) => s.name);

  // 4. Susun Payload baru sesuai standar ML yang baru
  const mlPayload = {
    education_required: userProfile.education_level,
    edu_bg: [userProfile.major],
    skills: userSkillNames,
    gpa: userProfile.gpa ? Number(userProfile.gpa) : 0.0,
    top_k: 5 
  };

  // 5. Tembak API ML
  const mlApiUrl = process.env.ML_API_URL || "http://localhost:5000/predict";
  const mlResponse = await fetch(mlApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mlPayload),
  });

  if (!mlResponse.ok) throw new Error("ML API Request Failed");

  const mlData = (await mlResponse.json()) as MLPredictionResponse;
  const topPredictions = mlData.top_k || [];
  const predictedCareerTitles = topPredictions.map((item: MLPredictionItem) => item.job_title);

  // 6. Cari ID Karir di DB dan Simpan Sesi Rekomendasi Baru
  const careersInDb = await prisma.career.findMany({
    where: { title: { in: predictedCareerTitles } },
  });

  if (careersInDb.length === 0) {
    throw new AppError(500, "Failed to map ML predictions to database careers.");
  }

  const careerMap = new Map(careersInDb.map((c) => [c.title, c.id]));

  const newSession = await prisma.recommendation_session.create({
    data: {
      user_id: userId,
      recommendation_history: {
        create: topPredictions
          .map((prediction: MLPredictionItem) => {
            const dbCareerId = careerMap.get(prediction.job_title);
            if (!dbCareerId) return null;

            const score = prediction.probability
              ? parseFloat((prediction.probability * 100).toFixed(2))
              : null;

            return {
              career_id: dbCareerId,
              match_score: score,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null),
      },
    },
  });

  return newSession;
}