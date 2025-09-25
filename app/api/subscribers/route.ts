import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, SubscriberStatus } from "@prisma/client";
import { SubscriberCreate } from "@/lib/validation";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();

  const parsed = SubscriberCreate.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    const subscriber = await prisma.subscriber.create({
      data: {
        email: parsed.data.email,
        status: SubscriberStatus.ACTIVE,
      },
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (e: unknown) {
    const error = e as { code?: string };

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
