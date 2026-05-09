import type { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  registerWithGoogle,
  loginWithGoogle,
} from "./auth.service.js";
import { sendResponse } from "../../lib/response.js";
import { verifyToken } from "../../lib/jwt.js";
import { AppError } from "../../lib/error.js";
import { setCookie, clearCookie } from "../../lib/cookie.js";
import { STATUS } from "../../lib/constant.js";

/**
 * Handles user registration.
 * Validates the request body, creates a new user, and returns the user data.
 *
 * @route POST /api/auth/register
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  try {
    const { user, token } = await registerUser(email, password);
    setCookie(res, token);
    sendResponse(res, 201, STATUS.SUCCESS, "Register successful", "user", { ...user, token });
  } catch (error) {
    next(error);
  }
}

export async function registerGoogle(req: Request, res: Response, next: NextFunction) {
  const { googleId, email, avatarUrl } = req.body;

  try {
    const user = await registerWithGoogle(googleId, email, avatarUrl);
    sendResponse(res, 201, STATUS.SUCCESS, "Register successful", "user", user);
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
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUser(email, password);
    const userData = { id: user.id, email: user.email, token: token };
    setCookie(res, token);
    sendResponse(res, 200, STATUS.SUCCESS, "Login successful", "user", userData);
  } catch (error) {
    next(error);
  }
}

export async function loginGoogle(req: Request, res: Response, next: NextFunction) {
  const { googleId } = req.body;

  try {
    const { user, token } = await loginWithGoogle(googleId);
    setCookie(res, token);
    sendResponse(res, 200, STATUS.SUCCESS, "Login successful", "user", { ...user, token });
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
    sendResponse(res, 200, STATUS.SUCCESS, "Logout successful");
  } catch (error) {
    next(error);
  }
}
