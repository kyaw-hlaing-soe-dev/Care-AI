import type { DeterministicAnalysis, VitalInput } from "../types.js";
import { db, FieldValue, Timestamp } from "../data/firestoreClient.js";
import { analysisRef, vitalRef } from "../data/firestorePaths.js";
import { analyzeVitals } from "./healthScoreService.js";
import {
  requestOpenRouter,
  type OpenRouterConfig,
} from "../providers/openRouterProvider.js";
import {
  AI_UNAVAILABLE_MESSAGE,
  CAREAI_DISCLAIMER,
} from "../validators/aiOutputValidator.js";

export type AnalysisRunResult = {
  status: "completed" | "failed" | "busy";
  retryable: boolean;
};

export async function runAnalysis(
  uid: string,
  readingId: string,
  config: OpenRouterConfig,
): Promise<AnalysisRunResult> {
  const readingRef = vitalRef(uid, readingId);
  const result = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(readingRef);
    if (!snapshot.exists) return { kind: "missing" as const };
    if (snapshot.get("analysisStatus") === "completed")
      return { kind: "completed" as const };
    const leaseUntil = snapshot.get("analysisLeaseUntil") as
      Timestamp | undefined;
    if (leaseUntil && leaseUntil.toMillis() > Date.now())
      return { kind: "busy" as const };
    transaction.update(readingRef, {
      analysisStatus: "pending",
      analysisLeaseUntil: Timestamp.fromMillis(Date.now() + 25_000),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return { kind: "claimed" as const, data: snapshot.data() ?? {} };
  });

  if (result.kind === "completed")
    return { status: "completed", retryable: false };
  if (result.kind === "busy" || result.kind === "missing")
    return { status: "busy", retryable: false };
  const input = readInput(result.data);
  const baseline = analyzeVitals(input);
  const provider = await requestOpenRouter(input, baseline, config);
  const analysis = provider.ok
    ? {
        ...provider.output,
        status: "completed",
        provider: "openrouter",
        model: provider.model,
        errorCode: null,
      }
    : {
        ...fallback(baseline),
        status: "failed",
        provider: "openrouter",
        model: provider.model,
        errorCode: "AI_ERROR",
      };

  const existing = await analysisRef(uid, readingId).get();
  const attemptCount = Number(existing.get("attemptCount") ?? 0) + 1;
  const batch = db.batch();
  batch.set(analysisRef(uid, readingId), {
    ...analysis,
    readingId,
    attemptCount,
    createdAt: existing.exists
      ? existing.get("createdAt")
      : FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  batch.update(readingRef, {
    analysisStatus: provider.ok ? "completed" : "failed",
    analysisLeaseUntil: FieldValue.delete(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await batch.commit();
  return {
    status: provider.ok ? "completed" : "failed",
    retryable: provider.ok ? false : provider.retryable,
  };
}

function readInput(data: Record<string, unknown>): VitalInput {
  return {
    systolic: Number(data.systolic),
    diastolic: Number(data.diastolic),
    heartRate: Number(data.heartRate),
    oxygenSaturation: Number(data.oxygenSaturation),
    temperatureC: Number(data.temperatureC),
  };
}

function fallback(baseline: DeterministicAnalysis) {
  return {
    summary: AI_UNAVAILABLE_MESSAGE,
    whatLooksGood: baseline.whatLooksGood.slice(0, 3),
    areasToWatch: baseline.areasToWatch.slice(0, 3),
    recommendations: [
      "Consider rechecking a measurement if it seems unexpected.",
      "Contact a qualified healthcare professional if you have concerns or symptoms.",
    ],
    urgency: baseline.urgency,
    disclaimer: CAREAI_DISCLAIMER,
  };
}
