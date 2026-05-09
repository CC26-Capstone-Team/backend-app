import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { onboard, onboardingFromPrediction } from "./onboarding.controller.js";

const router: IRouter = Router();

router.post("/", authMiddleware, onboard);
router.post("/from-prediction", authMiddleware, onboardingFromPrediction);

export default router;
