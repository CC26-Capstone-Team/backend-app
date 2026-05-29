import type { NextFunction, Request, Response } from "express";
import { reAnalyzeAndSavePrediction } from "./prediction.service.js";
import { sendResponse } from "../../lib/response.js";
import { STATUS } from "../../lib/constant.js";

export async function handleReAnalysis(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { skill_ids } = req.body;

    const newSession = await reAnalyzeAndSavePrediction(userId, skill_ids);

    sendResponse(
      res,
      201,
      STATUS.SUCCESS,
      "Analisis ulang berhasil, profil skill diperbarui.",
      "session",
      newSession
    );
  } catch (error) {
    next(error);
  }
}