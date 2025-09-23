import { PrismaClient } from "@prisma/client";
import { TaskType, TaskProcessingResult } from "./types";
import { processTask } from "./processor";
import { TASK_CONFIG } from "./config";

const prisma = new PrismaClient();

export async function runDueTasks(
  limit = TASK_CONFIG.DEFAULT_LIMIT,
): Promise<TaskProcessingResult> {
  const tasks: TaskType[] = await prisma.task.findMany({
    where: { status: "pending", runAt: { lte: new Date() } },
    orderBy: { runAt: "asc" },
    take: limit,
    select: { id: true, type: true, attempts: true, payload: true },
  });

  const results = await Promise.all(tasks.map(processTask));
  const processed = results.filter(Boolean).length;

  const statuses = await prisma.task.groupBy({
    by: ["status"],
    _count: true,
    where: { status: { in: ["pending", "failed"] } },
  });
  const counts = Object.fromEntries(statuses.map((s) => [s.status, s._count]));

  return {
    picked: tasks.length,
    processed,
    pending: counts.pending ?? 0,
    failed: counts.failed ?? 0,
  };
}

export { processTask } from "./processor";
export { taskHandlers } from "./handlers";
export type { TaskType, TaskHandler, EmailSendPayload } from "./types";
