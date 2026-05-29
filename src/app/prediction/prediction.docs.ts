import type { ZodOpenApiPathsObject } from "zod-openapi";
import { reAnalysisSchema } from "./prediction.schema.js";
import z from "zod";

const reAnalysisExample = {
  skill_ids: [
    "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
  ],
};

const predictionSuccessResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  session: z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    created_at: z.string().datetime(),
  }),
});

const successResponseExample = {
  status: "success",
  message: "Analisis ulang berhasil, profil skill diperbarui.",
  session: {
    id: "c7b3dcb6-9bdd-4bad-3b7d-9b1deb4d2b0d",
    user_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    created_at: "2026-05-29T15:30:00.000Z",
  },
};

export const predictionPaths: ZodOpenApiPathsObject = {
  "/api/predictions/re-analyze": {
    post: {
      tags: ["Predictions"],
      summary: "Analisis ulang rekomendasi karir berdasarkan pembaruan skill",
      description: "Endpoint ini digunakan di halaman dashboard untuk memperbarui daftar skill user sekaligus memicu ulang prediksi dari model Machine Learning.",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: reAnalysisSchema,
            example: reAnalysisExample,
          },
        },
      },
      responses: {
        201: {
          description: "Re-analysis completed and new session created",
          content: {
            "application/json": {
              schema: predictionSuccessResponseSchema,
              example: successResponseExample,
            },
          },
        },
        400: { 
          description: "Invalid input / One or more skill IDs are not valid UUIDs or not found in database" 
        },
        401: { 
          description: "Unauthorized - User session expired or token missing" 
        },
        404: { 
          description: "Not Found - User profile not found (must complete onboarding first)" 
        },
        500: { 
          description: "Internal Server Error - Machine Learning API connection failure or failed to map career data" 
        },
      },
    },
  },
};