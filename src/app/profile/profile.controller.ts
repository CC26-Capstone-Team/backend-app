import type { Request, Response, NextFunction } from "express";
import { addUserProfile, editUserProfile, userProfile } from "./profile.service.js";
import { sendResponse } from "../../lib/response.js";
import { STATUS } from "../../lib/constant.js";
import { createUserProfileSchema, updateUserProfileSchema } from "./profile.schema.js";
import { AppError } from "../../lib/error.js";

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

  const parsed = createUserProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new AppError(400, parsed.error.issues[0]?.message ?? "Invalid input"));
    return;
  }

  try {
    const { major, gpa } = parsed.data;
    const profile = await addUserProfile(userId, major, gpa);
    sendResponse(res, 201, STATUS.SUCCESS, "Profile Created", "profile", profile);
  } catch (error) {
    next(error);
  }
}

export async function updateUserProfile(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;
  const parsed = updateUserProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new AppError(400, parsed.error.issues[0]?.message ?? "Invalid input"));
    return;
  }

  try {
    const { major, gpa } = parsed.data;
    const profile = await editUserProfile(userId, major, gpa);
    sendResponse(res, 200, STATUS.SUCCESS, "Profile Updated", "profile", profile);
  } catch (error) {
    next(error);
  }
}
