import type { Request, Response, NextFunction } from "express";
import {
  generateCourseRecommendation,
  latestUserRecommendation,
  userRecommendationBySessionId,
  userRecommendations,
} from "./recommendation.service.js";
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

export async function getLatestUserRecommendation(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;

  try {
    const recommendation = await latestUserRecommendation(userId);
    sendResponse(
      res,
      200,
      STATUS.SUCCESS,
      "Retrieved Latest Recommendation",
      "recommendation",
      recommendation
    );
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

export async function getCourseRecommendation(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;
  const { target_career } = req.body;

  try {
    const recommendationData = await generateCourseRecommendation(userId, target_career);

    sendResponse(
      res,
      200,
      STATUS.SUCCESS,
      "Generated Course Recommendation",
      "course_recommendation",
      recommendationData
    );
  } catch (error: any) {
    if (error.status === 503 || error.message.includes("503")) {
      sendResponse(
        res,
        503,
        STATUS.ERROR,
        "AI Service Unavailable",
        "description",
        "Maaf, layanan AI sedang tidak tersedia saat ini. Silakan coba lagi nanti."
      );
    }

    next(error);
  }
}
