import type { Request, Response } from "express";
import { sendResponse } from "../lib/response.js";

/**
 * Middleware to handle requests to undefined routes.
 * Returns a 404 response for any unmatched route.
 */
export function notFoundHandler(_req: Request, res: Response) {
  sendResponse(res, 404, "Route not found");
}
