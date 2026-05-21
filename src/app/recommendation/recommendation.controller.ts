import type { Request, Response, NextFunction } from "express";
import { latestUserRecommendation, userRecommendationBySessionId, userRecommendations } from "./recommendation.service.js";
import { STATUS } from "../../lib/constant.js";
import { sendResponse } from "../../lib/response.js";

export default async function getUserRecommendations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user!.id;

  try {
    const recommendations = await userRecommendations(userId);
    sendResponse(
      res,
      200,
      STATUS.SUCCESS,
      "Retrieved User Recommendations",
      "recommendation_history",
      recommendations
    );
  } catch (error) {
    next(error);
  }
}

export async function getLatestUserRecommendation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user!.id;

  try {
    const recommendation = await latestUserRecommendation(userId);
    sendResponse(res, 200, STATUS.SUCCESS, "Retrieved Latest Recommendation", "recommendation", recommendation);
  } catch (error) {
    next(error);
  }
}

export async function getUserRecommendationBySessionId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session_id = req.params.session_id as string;

  try {
    const recommendation = await userRecommendationBySessionId(session_id);
    sendResponse(
      res,
      200,
      STATUS.SUCCESS,
      "Retrieved Recommendation",
      "recommendation_history",
      recommendation
    );
  } catch (error) {
    next(error);
  }
}
