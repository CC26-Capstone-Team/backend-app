import { prisma } from "../../lib/prisma.js";

const USER_ID = "dbcbf2c9-4e75-4eac-8eef-c1e68b73466e";

export async function seedRecommendation() {
  const careers = await prisma.career.findMany({ select: { id: true }, take: 5 });
  const careers2 = await prisma.career.findMany({ select: { id: true }, take: 5, skip: 5 });

  const session = await prisma.recommendation_session.create({
    data: {
      user_id: USER_ID,
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

  const session2 = await prisma.recommendation_session.create({
    data: {
      user_id: USER_ID,
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

  console.log(`✅ Recommendation seeded: session ${session.id}`);
  console.log(`✅ Recommendation seeded: session ${session2.id}`);
}
