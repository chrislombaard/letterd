import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function GET() {
  const rows = await prisma.cronExecution.findMany({
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  const last = rows[0] ?? null;
  return NextResponse.json({
    db:
      (process.env.DATABASE_URL || "").split("@").pop()?.split("?")[0] ||
      "unknown",
    total: await prisma.cronExecution.count(),
    lastKey: last?.key ?? null,
    lastAt: last?.createdAt ?? null,
  });
}
