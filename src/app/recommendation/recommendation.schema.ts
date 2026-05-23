import { Type, type Schema } from "@google/genai";

export const AIResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.STRING,
      description: "Analisis singkat kecocokan skill dengan target karir.",
    },
    courses: {
      type: Type.ARRAY,
      description: "Daftar materi atau topik kursus yang direkomendasikan.",
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          platform: { type: Type.STRING },
          reason: { type: Type.STRING },
          level: { type: Type.STRING },
        },
        required: ["topic", "platform", "reason", "level"],
      },
    },
  },
  required: ["analysis", "courses"], // Pastikan nama di sini sinkron
};

export const AIJobResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.STRING,
      description: "Analisis umum mengenai peluang karir user berdasarkan skill yang dimiliki.",
    },
    jobs: {
      type: Type.ARRAY,
      description: "Daftar lowongan beserta hasil analisis kecocokan AI.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company_name: { type: Type.STRING },
          location: { type: Type.STRING },
          via: { type: Type.STRING },
          match_score: { type: Type.INTEGER, description: "Skor kecocokan 1 sampai 100" },
          match_reason: {
            type: Type.STRING,
            description: "Alasan mengapa user cocok atau apa yang kurang",
          },
        },
        required: ["title", "company_name", "location", "via", "match_score", "match_reason"],
      },
    },
  },
  required: ["analysis", "jobs"],
};
