import { Router, type IRouter } from "express";
import { createUserProfile, getUserProfile, updateUserProfile } from "./profile.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import validateBody from "../../middleware/validate.middleware.js";
import { createUserProfileSchema, updateUserProfileSchema } from "./profile.schema.js";

const router: IRouter = Router();

router.get("/profile", authMiddleware, getUserProfile);
router.post("/profile", authMiddleware, validateBody(createUserProfileSchema), createUserProfile);
router.put("/profile", authMiddleware, validateBody(updateUserProfileSchema), updateUserProfile);

export default router;
