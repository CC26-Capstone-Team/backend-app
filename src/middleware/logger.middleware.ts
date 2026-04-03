import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";

/**
 * Middleware to automatically log all incoming HTTP requests.
 * Logs the method, URL, status code, and response time for every request.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`[${req.method}] ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
}
