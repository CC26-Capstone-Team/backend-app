import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../lib/response.js";
import { STATUS } from "../../lib/constant.js";
// Import file JSON dari tim ML
import featuresMetadata from "../../config/model_features_metadata.json" with { type: "json" };

export async function getEducationMetadata(req: Request, res: Response, next: NextFunction) {
  try {
    // Ambil array kategori dari JSON ML
    const educationLevels = featuresMetadata.features_metadata.education_required.categories;
    const educationBackgrounds = featuresMetadata.features_metadata.education_background.categories;

    const data = {
      education_levels: educationLevels,
      majors: educationBackgrounds,
    };

    sendResponse(
      res, 
      200, 
      STATUS.SUCCESS, 
      "Berhasil mengambil metadata pendidikan", 
      "metadata", 
      data
    );
  } catch (error) {
    next(error);
  }
}