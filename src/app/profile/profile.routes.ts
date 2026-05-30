import { Router, type IRouter } from "express";
import {
  createUserProfile,
  getUserProfile,
  getUserSkill,
  updateUserProfile,
  updateUserSkill,
  uploadAvatar,
} from "./profile.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import validateBody from "../../middleware/validate.middleware.js";
import {
  createUserProfileSchema,
  updateUserProfileSchema,
  updateUserSkillSchema,
} from "./profile.schema.js";
import { uploadAvatar as multerUploadAvatar } from "../../lib/multer.js";

const router: IRouter = Router();

router.get("/profile", authMiddleware, getUserProfile);
router.get('/profile/skill', authMiddleware, getUserSkill);
router.post("/profile", authMiddleware, validateBody(createUserProfileSchema), createUserProfile);
router.put("/profile", authMiddleware, validateBody(updateUserProfileSchema), updateUserProfile);
router.put("/profile/skill", authMiddleware, validateBody(updateUserSkillSchema), updateUserSkill);
router.post("/profile/avatar", authMiddleware, multerUploadAvatar.single("avatar"), uploadAvatar);

export default router;
