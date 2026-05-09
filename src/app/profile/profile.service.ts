import { AppError } from "../../lib/error.js";
import { prisma } from "../../lib/prisma.js";

export async function userProfile(userId: string) {
  const profile = await prisma.user_profile.findUnique({
    where: { user_id: userId },
  });

  if (!profile) throw new AppError(404, "Profile not found");

  return profile;
}

export async function addUserProfile(
  userId: string,
  education_level: string,
  major: string,
  gpa?: number
) {
  const existing = await prisma.user_profile.findUnique({ where: { user_id: userId } });

  if (existing) throw new AppError(409, "Profile already exists");

  const profile = await prisma.user_profile.create({
    data: {
      user_id: userId,
      education_level,
      major,
      gpa: gpa ?? null,
    },
  });

  return profile;
}

export async function editUserProfile(
  user_id: string,
  education_level?: string,
  major?: string,
  gpa?: number
) {
  const existing = await prisma.user_profile.findUnique({ where: { user_id } });

  if (!existing) throw new AppError(404, "Profile not found");

  const profile = await prisma.user_profile.update({
    where: { user_id },
    data: {
      education_level: education_level ?? existing.education_level,
      major: major ?? existing.major,
      gpa: gpa !== undefined ? gpa : existing.gpa,
    },
  });

  return profile;
}
