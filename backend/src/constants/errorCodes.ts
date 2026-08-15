import type { ErrorCode } from "../types.js";

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  AUTH_ERROR: "Please sign in again.",
  VALIDATION_ERROR: "Check the submitted values and try again.",
  DATABASE_ERROR: "We couldn't save or load your data. Try again.",
  AI_ERROR:
    "Your reading was saved, but CareAI analysis is temporarily unavailable.",
  NETWORK_ERROR: "We couldn't complete the request. Try again.",
  PERMISSION_ERROR: "You don't have permission to access this data.",
};
