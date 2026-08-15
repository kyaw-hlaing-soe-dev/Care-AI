import { logger } from "firebase-functions";

type LogMetadata = {
  requestId: string;
  operation: string;
  code?: string;
  status?: number;
};

export function logInfo(message: string, metadata: LogMetadata): void {
  logger.info(message, metadata);
}

export function logError(message: string, metadata: LogMetadata): void {
  logger.error(message, metadata);
}
