import { Router, type IRouter } from "express";
import authRoutes from "./auth/auth.routes.js";
import profileRoutes from "./profile/profile.routes.js";
import skillRoutes from "./skill/skill.route.js";
import onboardingRoutes from "./onboarding/onboarding.route.js";
import recommendationsRoutes from "./recommendation/recommendation.route.js";
import predictionRoutes from "./prediction/prediction.route.js";
import metadataRoute from "./metadata/metadata.route.js";

const router: IRouter = Router();

router.use("/auth", authRoutes);
router.use("/user", profileRoutes);
router.use("/skills", skillRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/recommendations", recommendationsRoutes);
router.use("/predictions", predictionRoutes);
router.use("/metadata", metadataRoute);

export default router;
