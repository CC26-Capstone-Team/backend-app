import { AppError } from "../../lib/error.js";
import { prisma } from "../../lib/prisma.js";

export async function userRecommendations(userId: string) {
  const recommendationSession = await prisma.recommendation_session.findMany({
    where: { user_id: userId },
    include: {
      recommendation_history: {
        include: {
          career: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return recommendationSession.map(({ recommendation_history, ...session }) => ({
    ...session,
    recommendation_history,
  }));
}

export async function userRecommendationBySessionId(sessionId: string) {
  const data = await prisma.recommendation_session.findUnique({
    where: { id: sessionId },
    include: {
      recommendation_history: {
        include: {
          career: true,
        },
      },
    },
  });

  if (!data) {
    throw new AppError(404, "Recommendation not found");
  }

  const { recommendation_history, ...session } = data;

  return {
    ...session,
    recommendation_history,
  };
}
