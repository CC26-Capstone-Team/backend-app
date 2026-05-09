import { Router, type IRouter } from "express";
import { getAllSkills } from "./skill.controller.js";

const router: IRouter = Router();

router.get("/", getAllSkills);

export default router;
