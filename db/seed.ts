import { PrismaClient, Prisma, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

const postData = [
  {
    title: "Welcome Post",
    subject: "Welcome to our newsletter!",
    bodyHtml: "<h1>Hello Laura!</h1>",
    status: PostStatus.SENT,
    scheduledAt: new Date(),
  },
  {
    title: "Promo Post",
    subject: "Special Offer!",
    bodyHtml: "<h1>Don't miss out!</h1>",
    status: PostStatus.SENT,
    scheduledAt: new Date(),
  },
];

export async function main() {
  const [welcomePost, promoPost] = await Promise.all(
    postData.map((post) => prisma.post.create({ data: post })),
  );

  const subscriberData: Prisma.SubscriberCreateInput[] = [
    {
      email: "laura@example.com",
      status: "ACTIVE",
      deliveries: {
        create: [
          {
            status: "SENT",
            post: { connect: { id: welcomePost.id } },
            sentAt: new Date(),
          },
        ],
      },
    },
    {
      email: "bob@example.com",
      status: "UNSUBSCRIBED",
      deliveries: {
        create: [
          {
            status: "FAILED",
            error: "Email bounced",
            post: { connect: { id: promoPost.id } },
          },
        ],
      },
    },
  ];

  for (const subscriber of subscriberData) {
    await prisma.subscriber.create({ data: subscriber });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
