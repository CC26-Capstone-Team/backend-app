import "dotenv/config";
import app from "./src/app.js";
import { prisma } from "./src/lib/prisma.js";
import { logger } from "./src/lib/logger.js";

const PORT = process.env.PORT ?? 5000;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Database connected ✅");

    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT} 🚀`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
