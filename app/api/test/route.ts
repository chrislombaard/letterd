import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "@/lib/errors";

export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const count = await prisma.post.count();
    return NextResponse.json({ ok: true, posts: count });
  } catch (err: unknown) {
    const error = ErrorHandler.handleDatabaseError(err, "Post count retrieval");
    
    return NextResponse.json(
      { ok: false, error: error.message, code: error.code },
      { status: error.statusCode },
    );
  }
}
