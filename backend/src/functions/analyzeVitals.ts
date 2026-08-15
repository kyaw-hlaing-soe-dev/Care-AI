import type { Request, Response } from "express";
import { verifyAuth } from "../auth/verifyAuth.js";
import { adminFunctions } from "../config/firebase.js";
import {
  openRouterApiKey,
  openRouterAppName,
  openRouterModel,
  openRouterSiteUrl,
} from "../config/env.js";
import {
  createReading,
  getReading,
  validateIdempotencyKey,
} from "../services/vitalService.js";
import { runAnalysis } from "../services/aiAnalysisService.js";
import { validateVitalInput } from "../validators/vitalValidator.js";
import { AppError } from "../utils/errors.js";

function providerConfig() {
  return {
    apiKey: readParameter(() => openRouterApiKey.value()),
    model: readParameter(() => openRouterModel.value()),
    siteUrl: readParameter(() => openRouterSiteUrl.value()) || undefined,
    appName: readParameter(() => openRouterAppName.value()) || "CareAI",
  };
}

function readParameter(read: () => string): string {
  try {
    return read().trim();
  } catch {
    return "";
  }
}

export async function analyzeVitals(
  request: Request,
  response: Response,
): Promise<void> {
  if (request.method !== "POST")
    throw new AppError("VALIDATION_ERROR", 405, "Unsupported method.");
  const uid = await verifyAuth(request);
  const input = validateVitalInput(request.body);
  const key = validateIdempotencyKey(request.header("idempotency-key"));
  const created = await createReading(uid, input, key);
  if (created.created) {
    await enqueueAnalysis(uid, created.readingId, 30).catch(() => undefined);
  }
  await runAnalysis(uid, created.readingId, providerConfig());
  const reading = await getReading(uid, created.readingId);
  response.json({ success: true, data: { reading } });
}

export async function retryAnalysis(
  request: Request,
  response: Response,
): Promise<void> {
  if (request.method !== "POST")
    throw new AppError("VALIDATION_ERROR", 405, "Unsupported method.");
  const uid = await verifyAuth(request);
  const rawReadingId = request.params.readingId;
  const readingId = typeof rawReadingId === "string" ? rawReadingId : "";
  const reading = await getReading(uid, readingId);
  if (!reading)
    throw new AppError("PERMISSION_ERROR", 404, "Reading not found.");
  if (reading.analysisStatus === "completed") {
    response.json({ success: true, data: { reading } });
    return;
  }
  const analysis = reading.analysis as Record<string, unknown> | null;
  if (Number(analysis?.attemptCount ?? 0) >= 3) {
    throw new AppError(
      "AI_ERROR",
      429,
      "CareAI analysis is unavailable for this reading.",
    );
  }
  await enqueueAnalysis(uid, readingId, 0);
  response
    .status(202)
    .json({ success: true, data: { readingId, analysisStatus: "pending" } });
}

export async function enqueueAnalysis(
  uid: string,
  readingId: string,
  scheduleDelaySeconds: number,
): Promise<void> {
  await adminFunctions
    .taskQueue("locations/asia-southeast1/functions/processAnalysisRetry")
    .enqueue(
      { uid, readingId },
      { scheduleDelaySeconds, dispatchDeadlineSeconds: 60 },
    );
}

export { providerConfig };
