import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import validateBody from "../../middleware/validate.middleware.js";
import { handleReAnalysis } from "./prediction.controller.js";
import { reAnalysisSchema } from "./prediction.schema.js";

const router: IRouter = Router();

// POST /api/predictions/re-analyze
router.post(
  "/re-analyze", 
  authMiddleware, 
  validateBody(reAnalysisSchema), 
  handleReAnalysis
);

export default router;