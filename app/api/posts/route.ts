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
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      subject: parsed.data.subject,
      bodyHtml: parsed.data.bodyHtml,
      status: data.scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
