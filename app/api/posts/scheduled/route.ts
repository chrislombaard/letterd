import { NextResponse } from "next/server";
import { PrismaClient, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const scheduledPosts = await prisma.post.findMany({
      where: {
        status: PostStatus.SCHEDULED,
        scheduledAt: { gte: new Date() },
      },
      orderBy: { scheduledAt: "asc" },
      select: {
        id: true,
        title: true,
        subject: true,
        scheduledAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(scheduledPosts);
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch scheduled posts" },
      { status: 500 },
    );
  }
}
