import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./app/route.js";
import { sendResponse } from "./lib/response.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/notfound.middleware.js";
import { requestLogger } from "./middleware/logger.middleware.js";
import { setupSwagger } from "./lib/swagger.js";
import { STATUS } from "./lib/constant.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

// Serve static uploaded files
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/", (_req: Request, res: Response) => {
  sendResponse(res, 200, STATUS.SUCCESS, "Backend Capstone API is Healthy! 🚀");
});

app.use("/api", routes);

setupSwagger(app);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
