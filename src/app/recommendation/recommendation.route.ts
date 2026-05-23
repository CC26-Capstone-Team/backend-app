import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import getUserRecommendations, {
  getCourseRecommendation,
  getJobsRecommndation,
  getLatestUserRecommendation,
  getUserRecommendationBySessionId,
} from "./recommendation.controller.js";

const router: IRouter = Router();

router.get("/latest", authMiddleware, getLatestUserRecommendation);
router.get("/history", authMiddleware, getUserRecommendations);
router.get("/history/:session_id", authMiddleware, getUserRecommendationBySessionId);
router.get("/course/:target_career", authMiddleware, getCourseRecommendation);
router.get("/jobs/:target_career", authMiddleware, getJobsRecommndation);

export default router;
