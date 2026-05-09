import type { NextFunction, Request, Response } from "express";
import { onboardingSchema } from "./onboarding.schema.js";
import { AppError } from "../../lib/error.js";
import { submitOnboarding } from "./onboarding.service.js";
import { sendResponse } from "../../lib/response.js";
import { STATUS } from "../../lib/constant.js";

async function handleOnboarding(req: Request, res: Response, next: NextFunction) {
  const userId = req.user!.id;

  const parsed = onboardingSchema.safeParse(req.body);

  if (!parsed.success) {
    next(new AppError(400, parsed.error.issues[0]?.message ?? "Invalid input"));
    return;
  }

  try {
    const { education_level, major, gpa, skill_ids } = parsed.data;
    await submitOnboarding(userId, education_level, major, gpa, skill_ids);
    sendResponse(res, 201, STATUS.SUCCESS, "Onboarding submitted");
  } catch (error) {
    next(error);
  }
}

export const onboard = handleOnboarding;
export const onboardingFromPrediction = handleOnboarding;
