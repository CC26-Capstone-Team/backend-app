import type { Response } from "express";

export function sendResponse<T>(
  res: Response,
  status: number,
  message: string,
  fieldName?: string,
  data?: T
) {
  res.status(status).json({
    message,
    ...(fieldName && data !== undefined ? { [fieldName]: data } : {}),
  });
}
