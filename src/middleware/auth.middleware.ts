import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";
import { sendResponse } from "../lib/response.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token as string | undefined;
  if (!token) {
    sendResponse(res, 401, "Unauthorized");
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    sendResponse(res, 401, "Unauthorized");
  }
}
