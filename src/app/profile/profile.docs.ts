import type { ZodOpenApiPathsObject } from "zod-openapi";
import { createUserProfileSchema, updateUserProfileSchema } from "./profile.schema.js";

const profileExample = {
  id: "cm9x1y2z3a4b5c6d7e8f9g0h",
  user_id: "cm9x1y2z3a4b5c6d7e8f9g0h",
  major: "Informatika",
  gpa: 3.75,
  updated_at: "2026-04-29T00:00:00.000Z",
};

export const userProfilePaths: ZodOpenApiPathsObject = {
  "/api/user/profile": {
    get: {
      tags: ["User Profile"],
      summary: "Ambil profile user yang sedang login",
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: "Profile retrieved",
          content: {
            "application/json": {
              example: { status: "success", message: "Profile retrieved", profile: profileExample },
            },
          },
        },
        401: { description: "Unauthorized" },
        404: {
          description: "Profile not found",
          content: {
            "application/json": {
              example: { status: "error", message: "Profile not found" },
            },
          },
        },
      },
    },
    post: {
      tags: ["User Profile"],
      summary: "Buat profile baru",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: createUserProfileSchema,
            example: { major: "Informatika", gpa: 3.75 },
          },
        },
      },
      responses: {
        201: {
          description: "Profile created",
          content: {
            "application/json": {
              example: { status: "success", message: "Profile created", profile: profileExample },
            },
          },
        },
        400: { description: "Invalid input" },
        401: { description: "Unauthorized" },
        409: {
          description: "Profile already exists",
          content: {
            "application/json": {
              example: { status: "error", message: "Profile already exists" },
            },
          },
        },
      },
    },
    put: {
      tags: ["User Profile"],
      summary: "Update profile user",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: updateUserProfileSchema,
            example: { gpa: 3.8 },
          },
        },
      },
      responses: {
        200: {
          description: "Profile updated",
          content: {
            "application/json": {
              example: {
                status: "success",
                message: "Profile updated",
                profile: { ...profileExample, gpa: 3.8 },
              },
            },
          },
        },
        400: { description: "Invalid input" },
        401: { description: "Unauthorized" },
        404: {
          description: "Profile not found",
          content: {
            "application/json": {
              example: { status: "error", message: "Profile not found" },
            },
          },
        },
      },
    },
  },
};
