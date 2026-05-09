import { AppError } from "../../lib/error.js";
import { prisma } from "../../lib/prisma.js";

export async function submitOnboarding(
  userId: string,
  education_level: string,
  major: string,
  gpa: number | undefined,
  skill_ids: string[]
) {
  const existingProfile = await prisma.user_profile.findUnique({ where: { user_id: userId } });
  if (existingProfile) {
    throw new AppError(409, "Profile already created");
  }

  const validSkills = await prisma.skill.findMany({ where: { id: { in: skill_ids } } });
  if (validSkills.length !== skill_ids.length) {
    throw new AppError(400, "One or more skills are invalid");
  }

  await prisma.$transaction([
    prisma.user_profile.create({
      data: {
        user_id: userId,
        education_level,
        major,
        gpa: gpa ?? null,
      },
    }),
    prisma.user_skill.createMany({
      data: skill_ids.map((skill_id) => ({ user_id: userId, skill_id })),
    }),
  ]);
}
