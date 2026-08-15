import type { Request, Response } from "express";
import { verifyAuth } from "../auth/verifyAuth.js";
import {
  getHistory as loadHistory,
  getHistoryItem,
} from "../services/historyService.js";
import { validateHistoryQuery } from "../validators/historyQueryValidator.js";
import { AppError } from "../utils/errors.js";

export async function getHistory(
  request: Request,
  response: Response,
): Promise<void> {
  if (request.method !== "GET")
    throw new AppError("VALIDATION_ERROR", 405, "Unsupported method.");
  const uid = await verifyAuth(request);
  response.json({
    success: true,
    data: await loadHistory(uid, validateHistoryQuery(request.query)),
  });
}

export async function getHistoryDetail(
  request: Request,
  response: Response,
): Promise<void> {
  if (request.method !== "GET")
    throw new AppError("VALIDATION_ERROR", 405, "Unsupported method.");
  const uid = await verifyAuth(request);
  const rawReadingId = request.params.readingId;
  response.json({
    success: true,
    data: {
      reading: await getHistoryItem(
        uid,
        typeof rawReadingId === "string" ? rawReadingId : "",
      ),
    },
  });
}
