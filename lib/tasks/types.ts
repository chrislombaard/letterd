import { Task } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export type TaskType = Pick<Task, "id" | "type" | "attempts" | "payload"> & {
  payload: JsonValue | null;
};

export type TaskHandler = (task: TaskType) => Promise<void>;

export type TaskHandlerRegistry = Record<string, TaskHandler>;

export type EmailSendPayload = {
  deliveryId: string;
  to: string;
  subject: string;
  html: string;
};

export type TaskProcessingResult = {
  picked: number;
  processed: number;
  pending: number;
  failed: number;
};
