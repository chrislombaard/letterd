import { PrismaClient, Task } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

type TaskType = Pick<Task, "id" | "type" | "attempts" | "payload"> & {
  payload: JsonValue | null;
};

const prisma = new PrismaClient();

const handlers: Record<string, (task: TaskType) => Promise<void>> = {
  "demo.cleanup": async (task) => {
    console.log("[task] cleanup", task.id, task.payload);
  },
  "email.send": async (task) => {
    console.log("[task] email.send", task.id, task.payload);
  },
  "demo.fail": async (task) => {
    console.log("[task] failing intentionally", task.id);
    throw new Error("Intentional failure for testing retries");
  },
};

const MAX_ATTEMPTS = 5;
const BACKOFF_MINUTES = 5;

const backoffAt = (attempts: number) =>
  new Date(Date.now() + attempts * BACKOFF_MINUTES * 60 * 1000);

async function processTask(task: TaskType) {
  try {
    await prisma.task.update({
      where: { id: task.id },
      data: { status: "processing", attempts: { increment: 1 } },
    });

    const handler = handlers[task.type];

    if (!handler) throw new Error(`No handler for type=${task.type}`);

    await handler(task);

    await prisma.task.update({
      where: { id: task.id },
      data: { status: "done" },
    });

    return true;
  } catch (err) {
    const attempts = task.attempts + 1;
    const data =
      attempts >= MAX_ATTEMPTS
        ? { status: "failed" as const }
        : { status: "pending" as const, runAt: backoffAt(attempts), attempts };

    await prisma.task.update({ where: { id: task.id }, data });

    console.error(
      "[task failed]",
      task.id,
      err instanceof Error ? err.message : err
    );
    return false;
  }
}

export async function runDueTasks(limit = 25) {
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
