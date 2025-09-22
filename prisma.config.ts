import path from "node:path";
import type { PrismaConfig } from "prisma";

// Using dotenv here so that the Prisma CLI (which doesn't support
// loading .env files by default) can still pick up the DATABASE_URL
// when running commands like `prisma migrate dev` or `prisma db pull`.
import { config } from "dotenv";
config({ path: ".env" }); // or ".env.local" if that’s where DATABASE_URL lives


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
