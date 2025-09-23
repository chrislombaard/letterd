export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = "INTERNAL_SERVER_ERROR",
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: unknown) {
    const errorMessage =
      originalError instanceof Error
        ? `${message}: ${originalError.message}`
        : message;

    super(errorMessage, "DATABASE_ERROR", 500);
  }
}

export class EmailError extends AppError {
  constructor(message: string, originalError?: unknown) {
    const errorMessage =
      originalError instanceof Error
        ? `${message}: ${originalError.message}`
        : message;

    super(errorMessage, "EMAIL_ERROR", 500);
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super(
      "Rate limit exceeded. Please wait a moment before trying again.",
      "RATE_LIMIT_ERROR",
      429,
    );
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, "AUTH_ERROR", 401);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, "NOT_FOUND_ERROR", 404);
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string) {
    super(message, "CONFIGURATION_ERROR", 500);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, originalError?: unknown) {
    const errorMessage =
      originalError instanceof Error
        ? `${service} service error: ${message} - ${originalError.message}`
        : `${service} service error: ${message}`;

    super(errorMessage, "EXTERNAL_SERVICE_ERROR", 502);
  }
}

export class TaskProcessingError extends AppError {
  constructor(taskType: string, message: string) {
    super(
      `Task processing failed (${taskType}): ${message}`,
      "TASK_PROCESSING_ERROR",
      500,
    );
  }
}

export class ErrorHandler {
  static handleUnknownError(
    error: unknown,
    context: string = "Operation",
  ): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes("network") || message.includes("connection")) {
        return new ExternalServiceError("Network", error.message, error);
      }

      if (message.includes("timeout")) {
        return new AppError(
          `${context} timed out: ${error.message}`,
          "TIMEOUT_ERROR",
          408,
        );
      }

      if (message.includes("permission") || message.includes("forbidden")) {
        return new AppError(
          `${context} permission denied: ${error.message}`,
          "PERMISSION_ERROR",
          403,
        );
      }

      return new AppError(
        `${context} failed: ${error.message}`,
        "OPERATION_ERROR",
        500,
      );
    }

    if (typeof error === "string") {
      return new AppError(
        `${context} failed: ${error}`,
        "OPERATION_ERROR",
        500,
      );
    }

    return new AppError(
      `${context} failed due to an unexpected error`,
      "UNEXPECTED_ERROR",
      500,
    );
  }

  static handleDatabaseError(
    error: unknown,
    operation: string = "Database operation",
  ): DatabaseError {
    if (error instanceof Error) {
      if ("code" in error) {
        const prismaError = error as { code: string; message: string };
        switch (prismaError.code) {
          case "P2002":
            return new DatabaseError(
              `${operation} failed: A record with this data already exists`,
              error,
            );
          case "P2025":
            return new DatabaseError(
              `${operation} failed: Record not found`,
              error,
            );
          case "P2003":
            return new DatabaseError(
              `${operation} failed: Foreign key constraint violated`,
              error,
            );
          case "P2014":
            return new DatabaseError(
              `${operation} failed: Invalid data relationship`,
              error,
            );
          case "P2021":
            return new DatabaseError(
              `${operation} failed: Table does not exist`,
              error,
            );
          case "P2022":
            return new DatabaseError(
              `${operation} failed: Column does not exist`,
              error,
            );
          case "P1008":
            return new DatabaseError(
              `${operation} failed: Database connection timeout`,
              error,
            );
          case "P1001":
            return new DatabaseError(
              `${operation} failed: Cannot reach database server`,
              error,
            );
          default:
            return new DatabaseError(
              `${operation} failed: Database error (${prismaError.code})`,
              error,
            );
        }
      }
      return new DatabaseError(`${operation} failed: ${error.message}`, error);
    }

    return new DatabaseError(`${operation} failed: Unexpected database error`);
  }

  static handleEmailError(error: unknown): EmailError {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes("rate limit")) {
        throw new RateLimitError();
      }

      if (
        message.includes("invalid api key") ||
        message.includes("unauthorized") ||
        message.includes("forbidden")
      ) {
        return new ConfigurationError(
          "Email service API key is invalid or missing",
        );
      }

      if (message.includes("invalid email") || message.includes("malformed")) {
        return new ValidationError("Invalid email address format");
      }

      if (message.includes("bounce") || message.includes("undeliverable")) {
        return new EmailError("Email address is undeliverable", error);
      }

      if (message.includes("spam") || message.includes("blocked")) {
        return new EmailError("Email was blocked or marked as spam", error);
      }

      if (message.includes("quota") || message.includes("limit")) {
        return new EmailError("Email service quota exceeded", error);
      }

      return new EmailError("Email delivery failed", error);
    }

    return new EmailError("Email delivery failed due to unexpected error");
  }

  static handleTaskError(
    error: unknown,
    taskType: string,
  ): TaskProcessingError {
    if (error instanceof AppError) {
      return new TaskProcessingError(taskType, error.message);
    }

    if (error instanceof Error) {
      return new TaskProcessingError(taskType, error.message);
    }

    return new TaskProcessingError(taskType, "Unexpected task failure");
  }

  static toJSON(error: AppError) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    };
  }
}
