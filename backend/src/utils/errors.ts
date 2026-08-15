import type { ErrorCode } from "../types.js";
import { ERROR_MESSAGES } from "../constants/errorCodes.js";

export class AppError extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly status: number,
    message = ERROR_MESSAGES[code],
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (isRequestBodyError(error)) {
    return new AppError(
      "VALIDATION_ERROR",
      error.status,
      "Check the request body and try again.",
    );
  }
  return new AppError("DATABASE_ERROR", 500);
}

function isRequestBodyError(
  error: unknown,
): error is { status: 400 | 413 } {
  if (!error || typeof error !== "object") return false;
  const status = (error as { status?: unknown }).status;
  return status === 400 || status === 413;
}
