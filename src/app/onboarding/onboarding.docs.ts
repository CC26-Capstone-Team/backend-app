import type { ZodOpenApiPathsObject } from "zod-openapi";
import { onboardingSchema } from "./onboarding.schema.js";

const onboardingExample = {
  education_level: "S1",
  major: "Informatika",
  gpa: 3.75,
  skill_ids: ["uuid-1", "uuid-2"],
};

export const onboardingPaths: ZodOpenApiPathsObject = {
  "/api/onboarding": {
    post: {
      tags: ["Onboarding"],
      summary: "Submit data onboarding (register langsung)",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: onboardingSchema,
            example: onboardingExample,
          },
        },
      },
      responses: {
        201: { description: "Onboarding completed" },
        400: { description: "Invalid input / One or more skills are invalid" },
        401: { description: "Unauthorized" },
        409: { description: "Onboarding already completed" },
      },
    },
  },
  "/api/onboarding/from-prediction": {
    post: {
      tags: ["Onboarding"],
      summary: "Submit data onboarding dari hasil prediksi landing page",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: onboardingSchema,
            example: onboardingExample,
          },
        },
      },
      responses: {
        201: { description: "Onboarding completed" },
        400: { description: "Invalid input / One or more skills are invalid" },
        401: { description: "Unauthorized" },
        409: { description: "Onboarding already completed" },
      },
    },
  },
};
