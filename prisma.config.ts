import path from "node:path";
import type { PrismaConfig } from "prisma";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
} else {
  config();
}

if (!process.env.PRISMA_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.PRISMA_DATABASE_URL = process.env.DATABASE_URL;
}

export default {
  schema: path.join("db", "schema.prisma"),
  migrations: { path: path.join("db", "migrations") },
  views: { path: path.join("db", "views") },
  typedSql: { path: path.join("db", "queries") },
} satisfies PrismaConfig;
