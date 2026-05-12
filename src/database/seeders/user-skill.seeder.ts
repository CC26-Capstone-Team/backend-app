import { prisma } from "../../lib/prisma.js";

export async function seedUserSkills() {
  const user = await prisma.user.findMany({ select: { id: true } });
  if (!user) throw new Error("No user found for seeding");

  const skills = await prisma.skill.findMany({ select: { id: true }, take: 5 });
  if (!skills.length) throw new Error("No skills found for seeding");

  await prisma.user_skill.createMany({
    data: user.flatMap((u) => skills.map((s) => ({ user_id: u.id, skill_id: s.id }))),
    skipDuplicates: true,
  });

  console.log(`✅ UserSkill seeded: ${user.length * skills.length} records`);
}
