import type { NextFunction, Request, Response } from "express";
import { submitOnboarding } from "./onboarding.service.js";
import { sendResponse } from "../../lib/response.js";
import { STATUS } from "../../lib/constant.js";
import { generateAndSavePrediction } from "../prediction/prediction.service.js";
import { logger } from "../../lib/logger.js";

async function handleOnboarding(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;

  const { education_level, major, gpa, skill_ids } = req.body;

  try {
    await submitOnboarding(userId, education_level, major, gpa, skill_ids);

    try {
      await generateAndSavePrediction(userId);
    } catch (mlError) {
      logger.error(`Gaga menjalankan prediksi otomatis saat onboarding: ${mlError}`);
    }

    sendResponse(res, 201, STATUS.SUCCESS, "Onboarding submitted");
  } catch (error) {
    next(error);
  }
}

export const onboard = handleOnboarding;
export const onboardingFromPrediction = handleOnboarding;
