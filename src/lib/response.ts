import type { Response } from "express";

/**
 * Sends a standardized JSON response.
 *
 * @param res - The Express response object
 * @param status - The HTTP status code
 * @param message - The response message
 * @param fieldName - Optional key name for the data field in the response body
 * @param data - Optional data to include in the response body
 *
 * @example
 * // Without data
 * sendResponse(res, 200, "Logout successful");
 * // { message: "Logout successful" }
 *
 * @example
 * // With data
 * sendResponse(res, 201, "Register successful", "user", user);
 * // { message: "Register successful", user: { ... } }
 */
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
