import { PrismaClient } from "@prisma/client";
import { TaskType } from "./types";
import { taskHandlers } from "./handlers";
import { TASK_CONFIG, calculateBackoffTime } from "./config";

const prisma = new PrismaClient();

export async function processTask(task: TaskType): Promise<boolean> {
  try {
    await prisma.task.update({
      where: { id: task.id },
      data: { status: "processing", attempts: { increment: 1 } },
    });

    const handler = taskHandlers[task.type];

    if (!handler) {
      throw new Error(`No handler registered for task type: ${task.type}`);
    }

    await handler(task);

    await prisma.task.update({
      where: { id: task.id },
      data: { status: "done" },
    });

    return true;
  } catch (err) {
    const attempts = task.attempts + 1;
    const data =
      attempts >= TASK_CONFIG.MAX_ATTEMPTS
        ? { status: "failed" as const }
        : {
            status: "pending" as const,
            runAt: calculateBackoffTime(attempts),
            attempts,
          };

    await prisma.task.update({ where: { id: task.id }, data });

    console.error(
      "[task failed]",
      task.id,
      err instanceof Error ? err.message : err,
    );
    return false;
  }
}
