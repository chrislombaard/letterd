export const TASK_CONFIG = {
  MAX_ATTEMPTS: 5,
  BACKOFF_MINUTES: 5,
  DEFAULT_LIMIT: 25,
} as const;

export const calculateBackoffTime = (attempts: number): Date =>
  new Date(Date.now() + attempts * TASK_CONFIG.BACKOFF_MINUTES * 60 * 1000);
