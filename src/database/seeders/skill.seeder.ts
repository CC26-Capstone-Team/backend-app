import { prisma } from "../../lib/prisma.js";

export async function seedSkills() {
  const skills = ["Python", "JavaScript", "SQL", "Machine Learning", "Data Analysis"];

  await prisma.skill.createMany({
    data: skills.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log(`✅ Skills seeded: ${skills.length} skills`);
}
