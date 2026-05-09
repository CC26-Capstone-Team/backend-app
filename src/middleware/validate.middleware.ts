import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../lib/error.js";

const validateBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    next(new AppError(400, "Invalid input", errors));
    return;
  }

  req.body = parsed.data;
  next();
};

export default validateBody;
