import { AppError } from "../../lib/error.js";
import { prisma } from "../../lib/prisma.js";
import fs from "fs";
import path from "path";

export async function userProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatar_url: true,
      profile: true,
      skills: {
        select: {
          skill: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const { skills, ...rest } = user;
  return {
    ...rest,
    skills: skills.map((us) => us.skill),
  };
}

export async function getUserSkillProfile(userId: string) {
  const skills = await prisma.user_skill.findMany({
    where: { user_id: userId },
    select: { skill: true },
  });

  return { skills: skills.map((us) => us.skill) };
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

export async function editUserSkill(user_id: string, skill_ids: string[]) {
  const existingSkills = await prisma.skill.findMany({
    where: { id: { in: skill_ids } },
    select: { id: true },
  });

  if (existingSkills.length !== skill_ids.length) {
    throw new AppError(400, "One or more skill IDs are invalid");
  }

  await prisma.$transaction([
    prisma.user_skill.deleteMany({ where: { user_id } }),
    prisma.user_skill.createMany({
      data: skill_ids.map((skill_id) => ({ user_id, skill_id })),
    }),
  ]);

  const userSkill = (
    await prisma.user_skill.findMany({
      where: { user_id },
      select: { skill: true },
    })
  ).map((us) => us.skill);

  await prisma.$transaction([
    prisma.course_recommendation.deleteMany({
      where: { user_id },
    }),
    prisma.job_recommendation.deleteMany({
      where: { user_id },
    }),
  ]);

  return userSkill;
}

export async function uploadUserAvatar(userId: string, filePath: string, baseUrl: string) {
  // Ambil nama file saja (bukan path absolut) untuk konstruksi URL yang benar
  const filename = path.basename(filePath);
  const avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;

  // Hapus avatar lama jika bukan URL eksternal (Google, dll)
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { avatar_url: true } });
  if (user?.avatar_url && user.avatar_url.startsWith(baseUrl) && user.avatar_url.includes("/uploads/avatars/")) {
    const oldFilename = user.avatar_url.split("/uploads/avatars/")[1];
    if (oldFilename) {
      const oldFile = path.resolve("uploads", "avatars", oldFilename);
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { avatar_url: avatarUrl },
    select: { id: true, avatar_url: true },
  });

  return updated;
}
