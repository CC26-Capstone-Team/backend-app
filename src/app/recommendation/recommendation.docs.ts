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
  "/api/recommendations/course/{target_career}": {
    get: {
      tags: ["Recommendations"],
      summary: "Generate rekomendasi kursus berbasis AI berdasarkan target karir",
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: "target_career",
          in: "path",
          required: true,
          description: "Karir spesifik yang ingin dituju oleh user",
          schema: {
            type: "string",
            example: "Backend Developer",
          },
        },
      ],
      responses: {
        200: {
          description: "Course recommendations generated successfully",
          content: {
            "application/json": {
              example: {
                status: "success",
                message: "Generated Course Recommendation",
                course_recommendation: {
                  analysis:
                    "Anda memiliki dasar yang kuat dalam Python dan JavaScript, yang merupakan kombinasi serbaguna untuk berbagai peran teknologi...",
                  courses: [
                    {
                      topic: "Pengembangan Aplikasi Web Frontend Lanjutan dengan React.js",
                      platform: "Coursera, Udemy",
                      reason:
                        "Mengembangkan kemampuan JavaScript Anda ke tingkat profesional dalam membangun antarmuka pengguna...",
                      level: "Lanjutan",
                    },
                    {
                      topic: "Membangun API Skalabel dengan Django REST Framework atau FastAPI",
                      platform: "Udemy, Pluralsight",
                      reason:
                        "Memanfaatkan keahlian Python Anda untuk merancang dan mengimplementasikan backend API yang kuat dan skalabel...",
                      level: "Lanjutan",
                    },
                  ],
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request - Input target_career tidak valid atau hilang",
        },
        401: {
          description: "Unauthorized - User belum login",
        },
        503: {
          description: "Service Unavailable - Server AI sedang sibuk, coba beberapa saat lagi",
          content: {
            "application/json": {
              example: {
                status: "error",
                message: "AI Service Unavailable",
                description:
                  "Maaf, layanan AI sedang tidak tersedia saat ini. Silakan coba lagi nanti.",
              },
            },
          },
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/api/recommendations/jobs/{target_career}": {
    get: {
      tags: ["Recommendations"],
      summary: "Ambil rekomendasi lowongan pekerjaan berbasis AI dengan cache",
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: "target_career",
          in: "path",
          required: true,
          description: "Target karir spesifik yang ingin dicari (contoh: Backend Developer)",
          schema: {
            type: "string",
            example: "Backend Developer",
          },
        },
      ],
      responses: {
        200: {
          description: "Job recommendations retrieved successfully",
          content: {
            "application/json": {
              example: {
                status: "success",
                message: "Berhasil memuat rekomendasi lowongan pekerjaan",
                job_recommendation: {
                  source: "api_refresh",
                  analysis:
                    "Skill Anda sangat relevan dengan kebutuhan industri saat ini, terutama pemahaman tentang pembuatan RESTful API dan database relasional.",
                  jobs: [
                    {
                      title: "Backend Developer",
                      company_name: "Tech Nusantara",
                      location: "Jakarta, Indonesia",
                      via: "via LinkedIn",
                      match_score: 90,
                      match_reason:
                        "Anda memiliki skill Express.js dan PostgreSQL yang menjadi syarat utama di lowongan ini.",
                    },
                    {
                      title: "Node.js Engineer (Remote)",
                      company_name: "Global Tech Solutions",
                      location: "Indonesia",
                      via: "via Glints",
                      match_score: 75,
                      match_reason:
                        "Skill dasar Anda cocok, namun Anda perlu memperdalam arsitektur Microservices untuk posisi ini.",
                    },
                  ],
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request - Parameter target_career kosong",
        },
        401: {
          description: "Unauthorized - User belum login",
        },
        404: {
          description: "Not Found - Tidak ada lowongan baru dari sumber data",
          content: {
            "application/json": {
              example: {
                status: "error",
                message: "Tidak dapat menemukan data lowongan terbaru dari sumber kami.",
                job_recommendation: {
                  analysis: "Tidak dapat menemukan data lowongan terbaru dari sumber kami.",
                  jobs: [],
                },
              },
            },
          },
        },
        503: {
          description: "Service Unavailable - Server AI sedang sibuk",
          content: {
            "application/json": {
              example: {
                status: "error",
                message: "Layanan AI sedang sibuk",
                job_recommendation: {
                  analysis:
                    "Maaf, layanan AI sedang tidak tersedia saat ini karena tingginya lalu lintas server. Silakan coba beberapa saat lagi.",
                  jobs: [],
                },
              },
            },
          },
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
};
