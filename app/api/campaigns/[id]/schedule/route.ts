import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CampaignSchedule } from "@/lib/validation";
import z from "zod";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;
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
    where: { id },
    data: { scheduledAt: parsed.data.scheduledAt, status: "SCHEDULED" },
    select: { id: true, status: true, scheduledAt: true },
  });

  return NextResponse.json(campaign);
}
