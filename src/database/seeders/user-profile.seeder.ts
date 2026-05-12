import { prisma } from "../../lib/prisma.js";

export async function seedUserProfile() {
  const user = await prisma.user.findMany({ select: { id: true } });
  if (!user) throw new Error("No user found for seeding");

  const majors = ["Computer Science", "Informatic Engineer", "Economy"];
  const gpa = [3.47, 3.14, 2.98];
  const education_level = ["S1", "S2", "S3"];

  await prisma.user_profile.createMany({
    data: user.map((u, index) => ({
      user_id: u.id,
      major: majors[index % majors.length]!,
      gpa: gpa[index % gpa.length]!,
      education_level: education_level[index % education_level.length]!,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ UserProfile seeded: ${user.length} profiles`);
}
