import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.email().max(255),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.email().max(255),
  password: z.string(),
});

export const googleAuthSchema = z.object({
  googleId: z.string(),
  email: z.email().max(255),
  avatarUrl: z.string().url().optional(),
});
