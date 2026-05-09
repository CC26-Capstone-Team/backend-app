import { Router, type IRouter } from "express";
import authRoutes from "./auth/auth.routes.js";
import profileRoutes from "./profile/profile.routes.js";
import skillRoutes from "./skill/skill.route.js";
import onboardingRoutes from "./onboarding/onboarding.route.js";

const router: IRouter = Router();

router.use("/auth", authRoutes);
router.use("/user", profileRoutes);
router.use("/skills", skillRoutes);
router.use("/onboarding", onboardingRoutes);

export default router;
