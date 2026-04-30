import { Router, type IRouter } from "express";
import authRoutes from "./auth/auth.routes.js";
import profileRoutes from "./profile/profile.routes.js";

const router: IRouter = Router();

router.use("/auth", authRoutes);
router.use("/user", profileRoutes);

export default router;
