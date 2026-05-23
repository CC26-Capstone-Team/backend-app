import type { Request, Response, NextFunction } from "express";
import { getJobsByCareer } from "./job.service.js";
import { STATUS } from "../../lib/constant.js";
import { sendResponse } from "../../lib/response.js";

export async function getCareerJobs(req: Request, res: Response, next: NextFunction) {
  const careerId = req.params.career_id as string;

  try {
    const jobs = await getJobsByCareer(careerId);
    
    sendResponse(
      res,
      200,
      STATUS.SUCCESS,
      "Retrieved Job Openings",
      "jobs",
      jobs
    );
  } catch (error) {
    next(error);
  }
}
