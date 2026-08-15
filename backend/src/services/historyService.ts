import { Timestamp } from "../data/firestoreClient.js";
import { db } from "../data/firestoreClient.js";
import { analysesRef, vitalRef, vitalsRef } from "../data/firestorePaths.js";
import type { HistoryQuery } from "../validators/historyQueryValidator.js";
import { AppError } from "../utils/errors.js";
import { getReading, joinReading } from "./vitalService.js";

export async function getHistory(
  uid: string,
  input: HistoryQuery,
): Promise<Record<string, unknown>> {
  let query = vitalsRef(uid).orderBy("createdAt", "desc");
  if (input.period !== "all") {
    const days = input.period === "7d" ? 7 : 30;
    query = query.where(
      "createdAt",
      ">=",
      Timestamp.fromMillis(Date.now() - days * 86_400_000),
    );
  }
  if (input.cursor) {
    const cursor = await vitalRef(uid, input.cursor).get();
    if (!cursor.exists)
      throw new AppError(
        "VALIDATION_ERROR",
        400,
        "The history cursor is invalid.",
      );
    query = query.startAfter(cursor);
  }
  const snapshot = await query.limit(input.pageSize + 1).get();
  const page = snapshot.docs.slice(0, input.pageSize);
  const analyses = page.length
    ? await db.getAll(
        ...page.map((reading) => analysesRef(uid).doc(reading.id)),
      )
    : [];
  const analysisById = new Map(
    analyses
      .filter((item) => item.exists)
      .map((item) => [item.id, item.data()]),
  );
  return {
    records: page.map((reading) =>
      joinReading(reading.id, reading.data(), analysisById.get(reading.id)),
    ),
    nextCursor:
      snapshot.size > input.pageSize ? (page.at(-1)?.id ?? null) : null,
  };
}

export async function getHistoryItem(
  uid: string,
  readingId: string,
): Promise<Record<string, unknown>> {
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(readingId))
    throw new AppError("VALIDATION_ERROR", 400);
  const record = await getReading(uid, readingId);
  if (!record)
    throw new AppError("PERMISSION_ERROR", 404, "Reading not found.");
  return record;
}
