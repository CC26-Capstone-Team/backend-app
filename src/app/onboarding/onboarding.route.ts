import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { onboard, onboardingFromPrediction } from "./onboarding.controller.js";
import validateBody from "../../middleware/validate.middleware.js";
import { onboardingSchema } from "./onboarding.schema.js";

const router: IRouter = Router();

router.post("/", authMiddleware, validateBody(onboardingSchema), onboard);
router.post(
  "/from-prediction",
  authMiddleware,
  validateBody(onboardingSchema),
  onboardingFromPrediction
);

export default router;
