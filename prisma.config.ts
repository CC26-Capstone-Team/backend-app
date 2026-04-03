import * as dotenv from "dotenv";
import { expand } from "dotenv-expand";

expand(dotenv.config());
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "src/database/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
