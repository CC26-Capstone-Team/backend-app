import type { Request, Response, NextFunction } from "express";
import { addUserProfile, editUserProfile, userProfile } from "./profile.service.js";
import { sendResponse } from "../../lib/response.js";
import { STATUS } from "../../lib/constant.js";

export async function getUserProfile(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;

  try {
    const profile = await userProfile(userId);
    sendResponse(res, 200, STATUS.SUCCESS, "Profile Retrieved", "profile", profile);
  } catch (error) {
    next(error);
  }
}

export async function createUserProfile(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;

  const { education_level, major, gpa } = req.body;

  try {
    const profile = await addUserProfile(userId, education_level, major, gpa);
    sendResponse(res, 201, STATUS.SUCCESS, "Profile Created", "profile", profile);
  } catch (error) {
    next(error);
  }
}

export async function updateUserProfile(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;

  const { education_level, major, gpa } = req.body;

  try {
    const profile = await editUserProfile(userId, education_level, major, gpa);
    sendResponse(res, 200, STATUS.SUCCESS, "Profile Updated", "profile", profile);
  } catch (error) {
    next(error);
  }
}
