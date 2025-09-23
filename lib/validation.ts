import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  subject: z.string().min(1).max(300),
  bodyHtml: z.string().min(1),
});

export const PostSchedule = z.object({
  scheduledAt: z.coerce.date(),
});
