// Prisma Edge client, but when we add background workers, switch to node prisma client
export const runtime = "edge"; 

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CampaignSchedule } from "@/lib/validation";
import z from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const json = await request.json();
  const parsed = CampaignSchedule.safeParse(json);

  if (!parsed.success) {
    // Simplify error responses (factory?)
    return NextResponse.json(
      { ok: false, error: z.treeifyError(parsed.error) },
      { status: 400 }
    );
  }

  const campaign = await prisma.campaign.update({
    where: { id: params.id },
    data: { scheduledAt: parsed.data.scheduledAt, status: "SCHEDULED" },
    select: { id: true, status: true, scheduledAt: true },
  });

  return NextResponse.json(campaign);
}
