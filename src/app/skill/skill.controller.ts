import type { NextFunction, Request, Response } from "express";
import { getAllSkill } from "./skill.service.js";
import { sendResponse } from "../../lib/response.js";
import { STATUS } from "../../lib/constant.js";

export async function getAllSkills(req: Request, res: Response, next: NextFunction) {
  try {
    const skills = await getAllSkill();

    sendResponse(res, 200, STATUS.SUCCESS, "Skill retrieved", "skills", skills);
  } catch (error) {
    next(error);
  }
}
