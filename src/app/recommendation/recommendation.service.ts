import { GoogleGenAI } from "@google/genai";
import { AppError } from "../../lib/error.js";
import { prisma } from "../../lib/prisma.js";
import type { AIRecommendationResult } from "./recommendation.types.js";
import { AIResponseSchema } from "./recommendation.schema.js";

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
  const data = await prisma.recommendation_session.findFirst({
    where: { user_id: userId },
    include: {
      recommendation_history: {
        include: { career: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  if (!data) {
    throw new AppError(404, "No recommendation found");
  }

  const { recommendation_history, ...session } = data;
  return { ...session, recommendation_history };
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
