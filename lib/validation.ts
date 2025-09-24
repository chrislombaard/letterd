import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  subject: z.string().min(1, "Subject is required").max(300, "Subject too long"),
  bodyHtml: z.string().min(1, "Content is required"),
  publishNow: z.boolean().optional(),
  scheduledAt: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      
      return parsedDate > new Date();
    }, "Scheduled date must be in the future"),
});

export const PostSchedule = z.object({
  scheduledAt: z.coerce.date().refine((date) => date > new Date(), {
    message: "Scheduled date must be in the future"
  }),
});

export const SubscriberCreate = z.object({
  email: z.string().email("Invalid email format"),
});

export const TaskPayload = z.object({
  id: z.string().min(1),
  type: z.enum(["email_send", "webhook", "notification"]),
  payload: z.record(z.string(), z.unknown()),
});
