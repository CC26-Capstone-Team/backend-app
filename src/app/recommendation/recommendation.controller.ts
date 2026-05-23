import type { Request, Response, NextFunction } from "express";
import {
  generateCourseRecommendation,
  generateJobRecommendation,
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
  const targetCareer = req.params.target_career as string;

  try {
    const recommendationData = await generateCourseRecommendation(userId, targetCareer);

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

export async function getJobsRecommndation(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;
  const targetCareer = req.params.target_career as string;
  const forceRefresh = req.query.force === "true";

  if (!targetCareer) {
    return sendResponse(
      res,
      400,
      STATUS.ERROR,
      "Target karir di URL tidak boleh kosong.",
      "job_recommendation",
      null
    );
  }

  try {
    const recommendationData = await generateJobRecommendation(userId, targetCareer, forceRefresh);

    sendResponse(
      res,
      200,
      STATUS.SUCCESS,
      "Generated job recommendation",
      "job_recommendation",
      recommendationData
    );
  } catch (error: any) {
    // 1. Tangkap Error Khusus AI (Gemini 503 / Overloaded / Unavailable)
    if (
      error.status === 503 ||
      error.message?.includes("503") ||
      error.message?.toLowerCase().includes("unavailable") ||
      error.message?.toLowerCase().includes("overloaded")
    ) {
      return sendResponse(res, 503, STATUS.ERROR, "Layanan AI sedang sibuk", "job_recommendation", {
        analysis:
          "Maaf, layanan AI sedang tidak tersedia saat ini karena tingginya lalu lintas server. Silakan coba beberapa saat lagi.",
        jobs: [], // Sangat penting: Kirim array kosong agar frontend (Next.js) tidak error saat menjalankan .map()
      });
    }

    // 2. Tangkap Error Khusus SerpApi (misalnya limit habis atau tidak ada hasil)
    if (
      error.message?.includes("SerpApi") ||
      error.message?.includes("lowongan kerja baru yang ditemukan")
    ) {
      return sendResponse(
        res,
        404, // Not Found
        STATUS.ERROR,
        error.message,
        "job_recommendation",
        {
          analysis: "Tidak dapat menemukan data lowongan terbaru dari sumber kami.",
          jobs: [],
        }
      );
    }

    next(error);
  }
}
