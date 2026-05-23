import { Router, type IRouter } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { getCareerJobs } from "./job.controller.js";

const router: IRouter = Router();

router.get("/recommendation/:career_id", authMiddleware, getCareerJobs);

export default router;
