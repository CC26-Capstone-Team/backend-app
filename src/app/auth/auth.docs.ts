import type { ZodOpenApiPathsObject } from "zod-openapi";
import { registerSchema, loginSchema } from "./auth.schema.js";

export const authPaths: ZodOpenApiPathsObject = {
  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Registrasi user baru",
      requestBody: {
        required: true,
        content: { "application/json": { schema: registerSchema } },
      },
      responses: {
        201: { description: "Register successful" },
        400: { description: "Invalid input" },
        409: { description: "Username already taken" },
      },
    },
  },
  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: { "application/json": { schema: loginSchema } },
      },
      responses: {
        200: { description: "Login successful" },
        400: { description: "Invalid input" },
        401: { description: "Invalid credentials" },
      },
    },
  },
  "/api/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout user",
      security: [{ cookieAuth: [] }],
      responses: {
        200: { description: "Logout successful" },
        401: { description: "Unauthorized" },
      },
    },
  },
};
