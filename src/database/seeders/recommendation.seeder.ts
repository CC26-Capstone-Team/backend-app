import { prisma } from "../../lib/prisma.js";

export async function seedRecommendation() {
  const user = await prisma.user.findFirst({ select: { id: true } });
  if (!user) throw new Error("No user found for seeding");

  const careers = await prisma.career.findMany({ select: { id: true }, take: 5 });
  const careers2 = await prisma.career.findMany({ select: { id: true }, take: 5, skip: 5 });

  const sessionAll = await Promise.all([
    prisma.recommendation_session.create({
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
    }),

    prisma.recommendation_session.create({
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
    }),
  ]);

  console.log(`✅ Recommendation seeded: ${sessionAll.length} sessions`);
}
