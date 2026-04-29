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

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(requestLogger);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  sendResponse(res, 200, STATUS.SUCCESS, "Backend Capstone API is Healthy! 🚀");
});

app.use("/api", routes);

setupSwagger(app);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
