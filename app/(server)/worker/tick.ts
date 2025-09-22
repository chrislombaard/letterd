import { prisma } from "@/lib/db";

export async function tick() {
  // Find all campaigns that are scheduled and due
  const dueCampaigns = await prisma.campaign.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: new Date() },
    },
  });

  for (const campaign of dueCampaigns) {
    // Mark as SENT 
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: "SENT" },
    });
    // Optionally: trigger delivery creation or email sending here
  }

  return { processed: dueCampaigns.length };
}

if (require.main === module) {
  tick().then((result) => {
    console.log("Tick complete:", result);
    process.exit(0);
  });
}
