import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // quick query — just return number of campaigns
    const count = await prisma.campaign.count();
    return NextResponse.json({ ok: true, campaigns: count });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
