import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import getUserRecommendations, {
  getCourseRecommendation,
  getLatestUserRecommendation,
  getUserRecommendationBySessionId,
} from "./recommendation.controller.js";

const router: IRouter = Router();

router.get("/latest", authMiddleware, getLatestUserRecommendation);
router.get("/history", authMiddleware, getUserRecommendations);
router.get("/history/:session_id", authMiddleware, getUserRecommendationBySessionId);
router.post("/course", authMiddleware, getCourseRecommendation);

export default router;
