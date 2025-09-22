export const runtime = "nodejs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { NextRequest, NextResponse } from "next/server";
import { CampaignCreate, CampaignSchedule } from "@/lib/validation";
import z from "zod";

export async function GET() {
  const items = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      subject: true,
      status: true,
      createdAt: true,
    },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = CampaignCreate.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: z.treeifyError(parsed.error) },
      { status: 400 }
    );
  }
  const campaign = await prisma.campaign.create({ data: parsed.data });
  return NextResponse.json(campaign, { status: 201 });
}
