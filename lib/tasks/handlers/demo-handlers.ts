import { TaskType } from "../types";

export async function handleDemoCleanup(task: TaskType): Promise<void> {
  console.log("[task] cleanup", task.id, task.payload);
}

export async function handleDemoFail(task: TaskType): Promise<void> {
  console.log("[task] failing intentionally", task.id);
  throw new Error("Intentional failure for testing retries");
}
