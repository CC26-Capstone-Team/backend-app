import { createDocument } from "zod-openapi";
import swaggerUi from "swagger-ui-express";
import type { Application } from "express";
import { authPaths } from "../app/auth/auth.docs.js";
import { userProfilePaths } from "../app/profile/profile.docs.js";
import { skillPaths } from "../app/skill/skill.docs.js";
import { onboardingPaths } from "../app/onboarding/onboarding.docs.js";
import { logger } from "./logger.js";
import { userRecommendationsPaths } from "../app/recommendation/recommendation.docs.js";

const PORT = process.env.PORT ?? 5000;

const document = createDocument({
  openapi: "3.1.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  components: {
    securitySchemes: {
      cookieAuth: { type: "apiKey", in: "cookie", name: "token" },
    },
  },
  paths: {
    ...authPaths,
    ...userProfilePaths,
    ...skillPaths,
    ...onboardingPaths,
    ...userRecommendationsPaths,
  },
});

export function setupSwagger(app: Application) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(document);
  });
  logger.info(`Swagger Docs available at http://localhost:${PORT}/api-docs 📑`);
}
