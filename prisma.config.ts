import path from "node:path";
import type { PrismaConfig } from "prisma";
import { config } from "dotenv";

// Ensure env vars are loaded for CLI commands (migrate, db pull, etc.)
config({ path: ".env" });

export default {
  schema: path.join("db", "schema.prisma"),
  migrations: {
    path: path.join("db", "migrations"),
  },
  views: {
    path: path.join("db", "views"),
  },
  typedSql: {
    path: path.join("db", "queries"),
  },
} satisfies PrismaConfig;
