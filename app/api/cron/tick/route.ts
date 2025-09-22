import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";
const prisma = new PrismaClient();

function truncateToHourUTC(date: Date): Date {
  const d = new Date(date.toISOString()); // normalize to UTC
  d.setUTCMinutes(0, 0, 0);
  return d;
}

export async function GET(req: NextRequest) {
  const isVercelCron = !!req.headers.get("x-vercel-cron");
  const secret = req.nextUrl.searchParams.get("secret");

  if (!isVercelCron && secret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  // 2) Ensure its only run once per hour
  const now = new Date();
  const windowStart = truncateToHourUTC(now);
  const key = `tick:${windowStart.toISOString()}`;

  try {
    // Claim this window; if it already exists => skip
    await prisma.cronExecution.create({ data: { key } });
  } catch (e: any) {
    // Unique violation means we've already run this window
    return NextResponse.json({ ok: true, skipped: true, window: key });
  }

  // 3) Do scheduled work (keep it fast; ideally < 5s)
  try {
    console.log(`[cron] ran window=${key}`);
    return NextResponse.json({ ok: true, ran: true, window: key });
  } catch (err) {
    console.error("[cron] job_failed", err);
    return NextResponse.json(
      { ok: false, error: "job_failed" },
      { status: 500 }
    );
  }
}
