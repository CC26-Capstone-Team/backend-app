import z from "zod";

export const onboardingSchema = z.object({
  education_level: z.string().min(2).max(100),
  major: z.string().min(2).max(100),
  gpa: z.number().min(0.0).max(4.0),
  skill_ids: z.array(z.string().uuid()).min(1),
});
