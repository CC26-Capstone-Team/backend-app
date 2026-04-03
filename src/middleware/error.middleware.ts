import type { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";
import { AppError } from "../lib/error.js";
import { sendResponse } from "../lib/response.js";
import { logger } from "../lib/logger.js";

/**
 * Global error handler middleware.
 * Catches all errors passed via next(error) and returns the appropriate HTTP response.
 *
 * Handles the following error types:
 * - AppError: returns the error's status and message
 * - PrismaClientKnownRequestError: maps Prisma error codes to HTTP responses
 * - Unknown errors: logs the error and returns 500
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    sendResponse(res, err.status, err.message);
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    logger.error(`Prisma error [${err.code}]: ${err.message}`);

    switch (err.code) {
      case "P2002":
        sendResponse(res, 409, "Data already exists");
        return;
      case "P2025":
        sendResponse(res, 404, "Data not found");
        return;
      case "P2003":
        sendResponse(res, 400, "Invalid relation");
        return;
      case "P2011":
        sendResponse(res, 400, "Required field is missing");
        return;
      default:
        sendResponse(res, 400, "Database error");
        return;
    }
  }

  logger.error(err instanceof Error ? err.message : String(err));
  sendResponse(res, 500, "Internal server error");
}
