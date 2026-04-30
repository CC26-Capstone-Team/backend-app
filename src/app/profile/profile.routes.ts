import { Router, type IRouter } from "express";
import { createUserProfile, getUserProfile, updateUserProfile } from "./profile.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router: IRouter = Router();

router.get("/profile", authMiddleware, getUserProfile);
router.post("/profile", authMiddleware, createUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
