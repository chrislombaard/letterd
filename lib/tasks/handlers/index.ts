import { TaskHandlerRegistry } from "../types";
import { handleEmailSend } from "./email-handler";

export const taskHandlers: TaskHandlerRegistry = {
  "email.send": handleEmailSend,
};
