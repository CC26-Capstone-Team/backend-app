import { AppError } from "../../lib/error.js";
import { prisma } from "../../lib/prisma.js";
import featuresMetadata from "../../config/model_features_metadata.json" with { type: "json" };
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

  // 2. Susun Payload 97 Fitur
  const features = new Array(97).fill(0.0);
  const ML_EDU_LEVELS = featuresMetadata.features_metadata.education_required.categories;
  const ML_EDU_BACKGROUNDS = featuresMetadata.features_metadata.education_background.categories;
  const ML_SKILLS = featuresMetadata.features_metadata.skills_required.categories;

  features[0] = Math.max(0, ML_EDU_LEVELS.indexOf(userProfile.education_level));
  features[1] = userProfile.gpa ? Number(userProfile.gpa) : 0.0;

  const majorIndex = ML_EDU_BACKGROUNDS.indexOf(userProfile.major);
  if (majorIndex !== -1) features[2 + majorIndex] = 1.0;

  userSkillNames.forEach((skillName) => {
    const skillIndex = ML_SKILLS.indexOf(skillName);
    if (skillIndex !== -1) features[15 + skillIndex] = 1.0;
  });

  // 3. Panggil API ML
  const mlApiUrl = process.env.ML_API_URL || "http://localhost:5000/predict";
  const mlResponse = await fetch(mlApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features, top_k: 5 }),
  });

  if (!mlResponse.ok) throw new Error("ML API Request Failed");

  // Cast JSON response ke interface yang sudah kita buat
  const mlData = (await mlResponse.json()) as MLPredictionResponse;

  const topPredictions = mlData.top_k || [];

  // TypeScript sekarang tahu bahwa 'item' memiliki properti 'job_title'
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
        // TypeScript juga tahu bahwa 'prediction' memiliki 'probability'
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

  // 2. Update data skill user di DB menggunakan Transaction (Hapus yang lama, Masukkan yang baru)
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

  // 4. Susun Payload 97 Fitur untuk ML
  const features = new Array(97).fill(0.0);
  const ML_EDU_LEVELS = featuresMetadata.features_metadata.education_required.categories;
  const ML_EDU_BACKGROUNDS = featuresMetadata.features_metadata.education_background.categories;
  const ML_SKILLS = featuresMetadata.features_metadata.skills_required.categories;

  // --- NORMALISASI MIN-MAX DIMULAI DI SINI ---

  // Index 0: Education Level
  // Karena ada 6 kategori (index 0 sampai 5), nilai maksimumnya adalah 5.0
  const eduIndex = Math.max(0, ML_EDU_LEVELS.indexOf(userProfile.education_level));
  features[0] = eduIndex / 5.0; // Hasilnya akan selalu di antara 0.0 hingga 1.0

  // Index 1: GPA / IPK
  // Asumsi nilai maksimum IPK di Indonesia adalah 4.0
  features[1] = userProfile.gpa ? Number(userProfile.gpa) / 4.0 : 0.0;

  // --- NORMALISASI SELESAI ---

  // Index 2 - 14: Jurusan (Sudah berupa 0.0 atau 1.0, jadi tidak perlu di-scale)
  const majorIndex = ML_EDU_BACKGROUNDS.indexOf(userProfile.major);
  if (majorIndex !== -1) features[2 + majorIndex] = 1.0;

  // Index 15 - 96: Skills (Sudah berupa 0.0 atau 1.0)
  userSkillNames.forEach((skillName) => {
    const skillIndex = ML_SKILLS.indexOf(skillName);
    if (skillIndex !== -1) features[15 + skillIndex] = 1.0;
  });

  // 5. Tembak API ML
  const mlApiUrl = process.env.ML_API_URL || "http://localhost:5000/predict";
  const mlResponse = await fetch(mlApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features, top_k: 5 }),
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
