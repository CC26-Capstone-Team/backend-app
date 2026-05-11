import z from "zod";

export const createUserProfileSchema = z.object({
  major: z.string().min(2).max(100),
  gpa: z.number().min(0.0).max(4.0).optional(),
  education_level: z.string().min(2).max(100),
});

export const updateUserProfileSchema = z.object({
  major: z.string().min(2).max(100).optional(),
  gpa: z.number().min(0.0).max(4.0).optional(),
  education_level: z.string().min(2).max(100).optional(),
});

export const updateUserSkillSchema = z.object({
  skill_ids: z.array(z.string().uuid()).min(1).max(5),
});
