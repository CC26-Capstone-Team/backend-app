import type { Request, Response, NextFunction } from "express";
import {
  addUserProfile,
  editUserProfile,
  editUserSkill,
  getUserSkillProfile,
  userProfile,
  uploadUserAvatar,
} from "./profile.service.js";
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

export async function getUserSkill(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;

  try {
    const skill = await getUserSkillProfile(userId);
    sendResponse(res, 200, STATUS.SUCCESS, "User Skill Retrieved", "skills", skill);
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

export async function updateUserSkill(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;

  const { skill_ids } = req.body;

  try {
    const profile = await editUserSkill(userId, skill_ids);
    sendResponse(res, 200, STATUS.SUCCESS, "Skill Updated", "profile", profile);
  } catch (error) {
    next(error);
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;

  try {
    if (!req.file) {
      res.status(400).json({ status: "error", message: "Tidak ada file yang diupload." });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const result = await uploadUserAvatar(userId, req.file.path, baseUrl);
    sendResponse(res, 200, STATUS.SUCCESS, "Avatar berhasil diperbarui", "user", result);
  } catch (error) {
    next(error);
  }
}
