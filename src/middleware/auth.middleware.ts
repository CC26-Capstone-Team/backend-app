import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";
import { sendResponse } from "../lib/response.js";

/**
 * Middleware to protect routes that require authentication.
 * Reads the JWT token from the cookie, verifies it, and attaches the decoded payload to req.user.
 * Returns 401 if the token is missing or invalid.
 *
 * @example
 * router.get("/profile", authMiddleware, getProfile);
 */
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
