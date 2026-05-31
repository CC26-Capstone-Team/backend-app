import type { Response } from "express";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none" as const,
  maxAge: COOKIE_MAX_AGE,
};

/**
 * Sets the JWT token as an httpOnly cookie in the response.
 *
 * @param res - The Express response object
 * @param token - The JWT token string to store in the cookie
 */
export function setCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, cookieOptions);
}

/**
 * Clears the JWT token cookie from the response.
 *
 * @param res - The Express response object
 */
export function clearCookie(res: Response) {
  const { maxAge, ...clearOptions } = cookieOptions;

  void maxAge;

  res.clearCookie(COOKIE_NAME, clearOptions);
}
