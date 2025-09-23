import { PrismaClient } from "@prisma/client";
import { mail } from "../../mail";
import { ErrorHandler } from "../../errors";
import { TaskType, EmailSendPayload } from "../types";

const prisma = new PrismaClient();

export async function handleEmailSend(task: TaskType): Promise<void> {
  if (!task.payload || typeof task.payload !== "object") return;
  const { deliveryId, to, subject, html } = task.payload as EmailSendPayload;
  
  try {
    const result = await mail.send({ to, subject, html });

    if (result.ok) {
      await prisma.delivery.update({
        where: { id: deliveryId },
        data: { status: "SENT", sentAt: new Date(), error: null },
      });
    } else {
      await prisma.delivery.update({
        where: { id: deliveryId },
        data: { status: "FAILED", error: result.error || "Email delivery failed" },
      });
    }
  } catch (err: unknown) {
    const error = ErrorHandler.handleTaskError(err, "email.send");
    
    await prisma.delivery.update({
      where: { id: deliveryId },
      data: { status: "FAILED", error: error.message },
    });
    throw error;
  }
}