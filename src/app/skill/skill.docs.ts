import type { ZodOpenApiPathsObject } from "zod-openapi";

export const skillPaths: ZodOpenApiPathsObject = {
  "/api/skills": {
    get: {
      tags: ["Skills"],
      summary: "Ambil semua skill yang tersedia",
      responses: {
        200: {
          description: "Skills retrieved",
          content: {
            "application/json": {
              example: {
                status: "success",
                message: "Skills retrieved",
                skills: [
                  { id: "uuid-1", name: "Python" },
                  { id: "uuid-2", name: "JavaScript" },
                ],
              },
            },
          },
        },
      },
    },
  },
};
