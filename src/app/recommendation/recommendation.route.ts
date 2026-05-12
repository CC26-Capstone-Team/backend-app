import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import getUserRecommendations, { getUserRecommendationBySessionId } from "./recommendation.controller.js";

const router: IRouter = Router();

router.get("/history", authMiddleware, getUserRecommendations);
router.get("/history/:session_id", authMiddleware, getUserRecommendationBySessionId);

export default router;
