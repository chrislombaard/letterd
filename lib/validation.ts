import { z } from "zod";

export const CampaignCreate = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  bodyHtml: z.string().min(1),
});

export const CampaignSchedule = z.object({
  scheduledAt: z.coerce.date(),
});
