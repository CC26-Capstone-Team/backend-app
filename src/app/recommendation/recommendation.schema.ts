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
