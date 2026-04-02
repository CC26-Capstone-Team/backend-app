import type { Request, Response } from "express";
import { sendResponse } from "../lib/response.js";

export function notFoundHandler(_req: Request, res: Response) {
  sendResponse(res, 404, "Route not found");
}
