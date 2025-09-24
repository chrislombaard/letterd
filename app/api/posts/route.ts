import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, PostStatus } from "@prisma/client";
import { CreatePostSchema } from "@/lib/validation";

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: PostStatus.SENT },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const parsed = CreatePostSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues },
      { status: 400 },
    );
  }

  let status: PostStatus;
  let scheduledAt: Date | null = null;

  if (parsed.data.publishNow) {
    status = PostStatus.SENT;
  } else if (parsed.data.scheduledAt) {
    status = PostStatus.SCHEDULED;
    scheduledAt = new Date(parsed.data.scheduledAt);
  } else {
    status = PostStatus.DRAFT;
  }

  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      subject: parsed.data.subject,
      bodyHtml: parsed.data.bodyHtml,
      status,
      scheduledAt,
    },
  });

  if (parsed.data.publishNow) {
    try {
      const { processPost } = await import("@/app/(server)/worker/tick");

      const subscribers = await prisma.subscriber.findMany({
        where: { status: "ACTIVE" },
      });

      await processPost(post, subscribers);

      return NextResponse.json(
        {
          ...post,
          publishedImmediately: true,
          subscribersCount: subscribers.length,
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("Failed to publish post immediately:", error);
      await prisma.post.update({
        where: { id: post.id },
        data: { status: PostStatus.DRAFT },
      });

      return NextResponse.json(
        { ok: false, error: "Failed to publish immediately" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(post, { status: 201 });
}
