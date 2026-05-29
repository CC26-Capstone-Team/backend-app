import { Router, type IRouter } from "express";
import { getEducationMetadata } from "./metadata.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js"; // Pakai jika user harus login dulu

const router: IRouter = Router();

// GET /api/metadata/education
router.get("/education", authMiddleware, getEducationMetadata);

export default router;