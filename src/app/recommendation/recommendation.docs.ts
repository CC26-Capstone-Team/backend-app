import type { ZodOpenApiPathsObject } from "zod-openapi";

export const userRecommendationsPaths: ZodOpenApiPathsObject = {
  "/api/recommendations/latest": {
    get: {
      tags: ["Recommendations"],
      summary: "Ambil rekomendasi terakhir user",
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: "Latest recommendation retrieved",
          content: {
            "application/json": {
              example: {
                status: "success",
                message: "Retrieved Latest Recommendation",
                recommendation: {},
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        404: { description: "No recommendation found" },
      },
    },
  },
  "/api/recommendations/history": {
    get: {
      tags: ["Recommendations"],
      summary: "Ambil riwayat rekomendasi user",
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: "User recommendations retrieved",
          content: {
            "application/json": {
              example: {
                status: "success",
                message: "Retrieved User Recommendations",
                recommendation_history: [],
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/recommendations/history/{session_id}": {
    get: {
      tags: ["Recommendations"],
      summary: "Ambil riwayat rekomendasi berdasarkan session id",
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: "session_id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "User recommendation retrieved",
          content: {
            "application/json": {
              example: {
                status: "success",
                message: "Retrieved Recommendation",
                recommendation_history: {},
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },
};
