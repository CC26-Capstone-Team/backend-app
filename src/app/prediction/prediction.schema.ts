import z from "zod";

export const reAnalysisSchema = z.object({
  skill_ids: z.array(z.string().uuid()).min(1),
});