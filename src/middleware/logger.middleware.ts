import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";

const SENSITIVE_FIELDS = ["password", "confirmPassword", "token", "secret"];

function redactBody(body: Record<string, unknown>) {
  const redacted = { ...body };
  for (const field of SENSITIVE_FIELDS) {
    if (field in redacted) redacted[field] = "[REDACTED]";
  }
  return redacted;
}

/**
 * Middleware to automatically log all incoming HTTP requests.
 * Logs the method, URL, status code, and response time for every request.
 */

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  if (req.body && Object.keys(req.body).length > 0) {
    logger.debug(
      `[${req.method}] ${req.originalUrl} body: ${JSON.stringify(redactBody(req.body))}`
    );
  }

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`[${req.method}] ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
}
