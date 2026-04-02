import type { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, logoutUser } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { sendResponse } from "../../lib/response.js";
import { verifyToken } from "../../lib/jwt.js";
import { AppError } from "../../lib/error.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response, next: NextFunction) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new AppError(400, parsed.error.issues[0]?.message ?? "Invalid input"));
    return;
  }

  try {
    const { username, password } = parsed.data;
    const { user, token } = await registerUser(username, password);
    res.cookie("token", token, cookieOptions);
    sendResponse(res, 201, "Register successful", "user", user);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new AppError(400, parsed.error.issues[0]?.message ?? "Invalid input"));
    return;
  }

  try {
    const { username, password } = parsed.data;
    const { user, token } = await loginUser(username, password);
    res.cookie("token", token, cookieOptions);
    sendResponse(res, 200, "Login successful", "user", user);
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token as string | undefined;
  if (!token) {
    next(new AppError(401, "Unauthorized"));
    return;
  }

  try {
    const payload = verifyToken(token);
    await logoutUser(payload.id);
    res.clearCookie("token");
    sendResponse(res, 200, "Logout successful");
  } catch (error) {
    next(error);
  }
}
