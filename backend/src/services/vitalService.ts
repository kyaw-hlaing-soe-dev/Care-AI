import { createHash } from "node:crypto";
import type { VitalInput } from "../types.js";
import { db, FieldValue } from "../data/firestoreClient.js";
import { analysisRef, vitalRef } from "../data/firestorePaths.js";
import { analyzeVitals } from "./healthScoreService.js";
import { AppError } from "../utils/errors.js";

export type CreateReadingResult = { readingId: string; created: boolean };

export function validateIdempotencyKey(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/.test(value.trim())
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "A valid Idempotency-Key header is required.",
    );
  }
  return value.trim();
}

export async function createReading(
  uid: string,
  input: VitalInput,
  key: string,
): Promise<CreateReadingResult> {
  const readingId = digest(`${uid}:${key}`).slice(0, 40);
  const requestHash = digest(JSON.stringify(input));
  const ref = vitalRef(uid, readingId);
  const created = await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(ref);
    if (existing.exists) {
      if (existing.get("requestHash") !== requestHash)
        throw new AppError(
          "VALIDATION_ERROR",
          409,
          "The idempotency key was already used for different readings.",
        );
      return false;
    }
    const baseline = analyzeVitals(input);
    transaction.create(ref, {
      ...input,
      healthScore: baseline.healthScore,
      status: baseline.status,
      emergency: baseline.emergency,
      urgency: baseline.urgency,
      algorithmVersion: "v1",
      analysisId: readingId,
      analysisStatus: "pending",
      requestHash,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
  return { readingId, created };
}

export async function getReading(
  uid: string,
  readingId: string,
): Promise<Record<string, unknown> | null> {
  const [reading, analysis] = await Promise.all([
    vitalRef(uid, readingId).get(),
    analysisRef(uid, readingId).get(),
  ]);
  if (!reading.exists) return null;
  return joinReading(
    reading.id,
    reading.data() ?? {},
    analysis.exists ? analysis.data() : undefined,
  );
}

export function joinReading(
  id: string,
  reading: Record<string, unknown>,
  analysis?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    id,
    ...serialize(reading),
    analysis: analysis ? serialize(analysis) : null,
  };
}

function digest(value: string): string {
  return createHash("sha256").update(value).digest("base64url");
}

export function serialize(
  value: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "requestHash")
      .map(([key, item]) => [
        key,
        item && typeof item === "object" && "toDate" in item
          ? (item as { toDate(): Date }).toDate().toISOString()
          : item,
      ]),
  );
}
