import { PrismaClient, Prisma, CampaignStatus } from "@prisma/client";

const prisma = new PrismaClient();

const campaignData = [
  {
    name: "Welcome Campaign",
    subject: "Welcome to our newsletter!",
    bodyHtml: "<h1>Hello Laura!</h1>",
    status: CampaignStatus.SENT,
    scheduledAt: new Date(),
  },
  {
    name: "Promo Campaign",
    subject: "Special Offer!",
    bodyHtml: "<h1>Don't miss out!</h1>",
    status: CampaignStatus.SENT,
    scheduledAt: new Date(),
  },
];

export async function main() {
  const [welcomeCampaign, promoCampaign] = await Promise.all(
    campaignData.map((campaign) => prisma.campaign.create({ data: campaign }))
  );

  const subscriberData: Prisma.SubscriberCreateInput[] = [
    {
      email: "laura@example.com",
      status: "ACTIVE",
      deliveries: {
        create: [
          {
            status: "SENT",
            campaign: { connect: { id: welcomeCampaign.id } },
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
            campaign: { connect: { id: promoCampaign.id } },
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
