export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runDueTasks } from "@/lib/task-runner";
import { tick as processScheduledPosts } from "@/app/(server)/worker/tick";
import { ErrorHandler, AuthenticationError } from "@/lib/errors";

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
    const authError = new AuthenticationError("Unauthorized cron access");
    return NextResponse.json(
      { ok: false, error: authError.message, code: authError.code },
      { status: authError.statusCode },
    );
  }

  const key = `tick:${truncateToHourUTC(new Date()).toISOString()}`;

  try {
    await prisma.cronExecution.create({ data: { key } });
  } catch (error: unknown) {
    const dbError = ErrorHandler.handleDatabaseError(
      error,
      "Cron execution tracking",
    );

    if (dbError.message.includes("already exists")) {
      return NextResponse.json({ ok: true, skipped: true, window: key });
    }

    console.error("[cron] insert_failed", ErrorHandler.toJSON(dbError));
    return NextResponse.json(
      { ok: false, error: dbError.message, code: dbError.code },
      { status: dbError.statusCode },
    );
  }

  const publishedPosts = await processScheduledPosts();

  const res = await runDueTasks(25);

  return NextResponse.json({
    ok: true,
    ran: true,
    window: key,
    publishedPosts,
    processed: res.processed,
    pending: res.pending,
    failed: res.failed,
  });
}
