import type { ZodOpenApiPathsObject } from "zod-openapi";
import z from "zod";

const metadataSuccessResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  metadata: z.object({
    education_levels: z.array(z.string()),
    majors: z.array(z.string()),
  }),
});

const successResponseExample = {
  status: "success",
  message: "Berhasil mengambil metadata pendidikan",
  metadata: {
    education_levels: [
      "High School",
      "Associate",
      "Bootcamp",
      "Bachelor's",
      "Master's",
      "PhD"
    ],
    majors: [
      "Administration",
      "Communication Science",
      "Computer Science",
      "Electrical Engineering",
      "Industrial Engineering",
      "Informatics Engineering",
      "Information Systems",
      "Law",
      "Management",
      "Mathematics",
      "Mechanical Engineering",
      "Psychology",
      "Statistics"
    ],
  },
};

// --- DOKUMENTASI PATHS OPENAPI ---
export const metadataPaths: ZodOpenApiPathsObject = {
  "/api/metadata/education": {
    get: {
      tags: ["Metadata"],
      summary: "Ambil master data tingkat pendidikan dan jurusan",
      description: "Endpoint ini menyediakan daftar opsi pendidikan dan jurusan yang valid dan sinkron dengan model Machine Learning untuk digunakan pada komponen dropdown halaman onboarding.",
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: "Metadata berhasil didapatkan",
          content: {
            "application/json": {
              schema: metadataSuccessResponseSchema,
              example: successResponseExample,
            },
          },
        },
        401: {
          description: "Unauthorized - Sesi pengguna tidak valid atau token hilang",
        },
        500: {
          description: "Internal Server Error - Gagal membaca file konfigurasi metadata",
        },
      },
    },
  },
};