import { prisma } from "@/lib/db";
import { generateNewsletterEmail } from "@/lib/email-template";
import type { Post, Subscriber } from "@prisma/client";

export async function processPost(post: Post, subscribers: Subscriber[]) {
  await prisma.post.update({
    where: { id: post.id },
    data: { status: "SENT" },
  });

  const deliveryPromises = subscribers.map(async (subscriber) => {
    const delivery = await prisma.delivery.create({
      data: {
        postId: post.id,
        subscriberId: subscriber.id,
        status: "PENDING",
      },
    });

    const emailHtml = generateNewsletterEmail({
      title: post.title,
      subject: post.subject,
      bodyHtml: post.bodyHtml,
      subscriberEmail: subscriber.email,
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${subscriber.id}`,
    });

    return prisma.task.create({
      data: {
        type: "email.send",
        payload: {
          deliveryId: delivery.id,
          to: subscriber.email,
          subject: post.subject,
          html: emailHtml,
        },
      },
    });
  });

  await Promise.all(deliveryPromises);
}

export async function tick() {
  const currentTime = new Date();
  
  const [duePosts, activeSubscribers] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lte: currentTime },
      },
    }),
    prisma.subscriber.findMany({
      where: { status: "ACTIVE" },
    }),
  ]);

  if (duePosts.length === 0) {
    return { processed: 0, message: "No scheduled posts due" };
  }

  if (activeSubscribers.length === 0) {
    return { processed: 0, message: "No active subscribers" };
  }

  await Promise.all(
    duePosts.map((post) => processPost(post, activeSubscribers)),
  );

  return {
    processed: duePosts.length,
    subscribersNotified: activeSubscribers.length,
    totalEmailsQueued: duePosts.length * activeSubscribers.length,
  };
}

if (require.main === module) {
  tick().then(() => {
    process.exit(0);
  });
}
