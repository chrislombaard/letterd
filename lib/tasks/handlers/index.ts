import { TaskHandlerRegistry } from "../types";
import { handleEmailSend } from "./email-handler";
import { handleDemoCleanup, handleDemoFail } from "./demo-handlers";

export const taskHandlers: TaskHandlerRegistry = {
  "demo.cleanup": handleDemoCleanup,
  "email.send": handleEmailSend,
  "demo.fail": handleDemoFail,
};