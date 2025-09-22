export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Body = {
  type: string; 
  payload?: unknown; 
  runAt?: string | number; 
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    );
  }

  if (!body.type || typeof body.type !== "string") {
    return NextResponse.json(
      { ok: false, error: "type_required" },
      { status: 400 }
    );
  }

  let runAt: Date | undefined = undefined;
  
  if (body.runAt) {
    runAt = new Date(body.runAt);

    if (isNaN(runAt.getTime())) {
      return NextResponse.json(
        { ok: false, error: "invalid_runAt" },
        { status: 400 }
      );
    }
  }

  const task = await prisma.task.create({
    data: {
      type: body.type,
      payload: body.payload ?? null,
      runAt: runAt ?? new Date(),
    },
  });

  return NextResponse.json({ ok: true, id: task.id });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status"); 

  const tasks = await prisma.task.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    ok: true,
    count: tasks.length,
    tasks,
  });
}
