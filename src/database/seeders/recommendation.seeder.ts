import { prisma } from "../../lib/prisma.js";

export async function seedRecommendation() {
  const users = await prisma.user.findMany({ select: { id: true } });
  if (!users.length) throw new Error("No users found for seeding");

  const careers = await prisma.career.findMany({ select: { id: true }, take: 5 });
  const careers2 = await prisma.career.findMany({ select: { id: true }, take: 5, skip: 5 });

  let totalSessions = 0;

  for (const user of users) {
    await prisma.recommendation_session.create({
      data: {
        user_id: user.id,
        recommendation_history: {
          createMany: {
            data: careers.map((career, index) => ({
              career_id: career.id,
              match_score: +(0.95 - index * 0.05).toFixed(2),
            })),
          },
        },
      },
    });

    await prisma.recommendation_session.create({
      data: {
        user_id: user.id,
        recommendation_history: {
          createMany: {
            data: careers2.map((career, index) => ({
              career_id: career.id,
              match_score: +(0.95 - index * 0.05).toFixed(2),
            })),
          },
        },
      },
    });

    totalSessions += 2;
  }

  console.log(`✅ Recommendation seeded: ${totalSessions} sessions for ${users.length} users`);
}
