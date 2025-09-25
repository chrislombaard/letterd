import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalPosts,
      scheduledPosts,
      sentPosts,
      totalSubscribers,
      activeSubscribers,
      pendingDeliveries,
      recentTasks,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "SCHEDULED" } }),
      prisma.post.count({ where: { status: "SENT" } }),
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { status: "ACTIVE" } }),
      prisma.delivery.count({ where: { status: "PENDING" } }),
      prisma.task.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Newsletter Admin Dashboard",
      timestamp: new Date().toISOString(),
      stats: {
        posts: {
          total: totalPosts,
          scheduled: scheduledPosts,
          sent: sentPosts,
        },
        subscribers: {
          total: totalSubscribers,
          active: activeSubscribers,
        },
        deliveries: {
          pending: pendingDeliveries,
        },
        recentTasks: recentTasks.length,
      },
      recentTasks,
      systemStatus: "operational",
    });
  } catch (error) {
    console.error("[admin] Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
