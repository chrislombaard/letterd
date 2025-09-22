export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runDueTasks } from "@/lib/task-runner";

const prisma = new PrismaClient();

function truncateToHourUTC(date: Date) {
  const truncated = new Date(date.toISOString());
  truncated.setUTCMinutes(0, 0, 0);
  return truncated;
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

  const key = `tick:${truncateToHourUTC(new Date()).toISOString()}`;

  try {
    await prisma.cronExecution.create({ data: { key } });
  } catch (error: any) {
    const msg = error?.message || "";
    const code = error?.code;
    const isUnique =
      code === "P2002" || /Unique constraint failed|duplicate key/i.test(msg);

    if (isUnique)
      return NextResponse.json({ ok: true, skipped: true, window: key });

    console.error("[cron] insert_failed", { code, msg });
    return NextResponse.json(
      { ok: false, error: "insert_failed", code, msg },
      { status: 500 }
    );
  }

  const res = await runDueTasks(25);

  return NextResponse.json({
    ok: true,
    ran: true,
    window: key,
    processed: res.processed,
    pending: res.pending,
    failed: res.failed,
  });
}
