import path from "node:path";
import type { PrismaConfig } from "prisma";
import { config } from "dotenv";

// Load .env.local in dev; in prod (Vercel), rely on real env vars
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
} else {
  config(); // loads .env if present; harmless on Vercel
}

// Optional: dev convenience — if PRISMA_DATABASE_URL is missing locally,
// fall back to DATABASE_URL (many people already have this set).
if (!process.env.PRISMA_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.PRISMA_DATABASE_URL = process.env.DATABASE_URL;
}

export default {
  schema: path.join("db", "schema.prisma"),
  migrations: { path: path.join("db", "migrations") },
  views: { path: path.join("db", "views") },
  typedSql: { path: path.join("db", "queries") },
} satisfies PrismaConfig;
