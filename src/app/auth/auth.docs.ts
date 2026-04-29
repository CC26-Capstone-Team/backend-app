import type { ZodOpenApiPathsObject } from "zod-openapi";
import { registerSchema, loginSchema, googleAuthSchema } from "./auth.schema.js";
import z from "zod";

export const authPaths: ZodOpenApiPathsObject = {
  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Registrasi user baru",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: registerSchema,
            example: { email: "user@example.com", password: "secret123" },
          },
        },
      },
      responses: {
        201: { description: "Register successful" },
        400: { description: "Invalid input" },
        409: { description: "Username already taken" },
      },
    },
  },
  "/api/auth/register/google": {
    post: {
      tags: ["Auth"],
      summary: "Registrasi user dengan Google",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: googleAuthSchema,
            example: {
              googleId: "1234567890",
              email: "user@gmail.com",
              avatarUrl: "https://example.com/avatar.jpg",
            },
          },
        },
      },
      responses: {
        201: { description: "Register successful" },
        409: { description: "Google account already registered" },
      },
    },
  },
  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: loginSchema,
            example: { email: "user@example.com", password: "secret123" },
          },
        },
      },
      responses: {
        200: { description: "Login successful" },
        400: { description: "Invalid input" },
        401: { description: "Invalid credentials" },
      },
    },
  },
  "/api/auth/login/google": {
    post: {
      tags: ["Auth"],
      summary: "Login dengan Google",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: z.object({ googleId: z.string() }),
            example: { googleId: "1234567890" },
          },
        },
      },
      responses: {
        200: { description: "Login successful" },
        401: { description: "Google account not registered" },
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
