import type { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, logoutUser } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { sendResponse } from "../../lib/response.js";
import { verifyToken } from "../../lib/jwt.js";
import { AppError } from "../../lib/error.js";
import { setCookie, clearCookie } from "../../lib/cookie.js";

/**
 * Handles user registration.
 * Validates the request body, creates a new user, and returns the user data.
 *
 * @route POST /api/auth/register
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new AppError(400, parsed.error.issues[0]?.message ?? "Invalid input"));
    return;
  }

  try {
    const { username, password } = parsed.data;
    const user = await registerUser(username, password);
    sendResponse(res, 201, "Register successful", "user", user);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles user login.
 * Validates the request body, authenticates the user, sets a JWT cookie, and returns the user data.
 *
 * @route POST /api/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new AppError(400, parsed.error.issues[0]?.message ?? "Invalid input"));
    return;
  }

  try {
    const { username, password } = parsed.data;
    const { user, token } = await loginUser(username, password);
    setCookie(res, token);
    sendResponse(res, 200, "Login successful", "user", user);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles user logout.
 * Verifies the JWT token from the cookie, clears the token from the database, and removes the cookie.
 *
 * @route POST /api/auth/logout
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token as string | undefined;
  if (!token) {
    next(new AppError(401, "Unauthorized"));
    return;
  }

  try {
    const payload = verifyToken(token);
    await logoutUser(payload.id);
    clearCookie(res);
    sendResponse(res, 200, "Logout successful");
  } catch (error) {
    next(error);
  }
}
