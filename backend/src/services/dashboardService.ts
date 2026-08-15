import { db } from "../data/firestoreClient.js";
import { analysesRef, vitalsRef } from "../data/firestorePaths.js";
import { getProfile } from "./profileService.js";
import { joinReading } from "./vitalService.js";

export async function getDashboard(
  uid: string,
): Promise<Record<string, unknown>> {
  const [profile, readings] = await Promise.all([
    getProfile(uid),
    vitalsRef(uid).orderBy("createdAt", "desc").limit(30).get(),
  ]);
  const analysisSnapshots = readings.empty
    ? []
    : await db.getAll(
        ...readings.docs.map((reading) => analysesRef(uid).doc(reading.id)),
      );
  const analysisById = new Map(
    analysisSnapshots
      .filter((item) => item.exists)
      .map((item) => [item.id, item.data()]),
  );
  const recentReadings = readings.docs.map((reading) =>
    joinReading(reading.id, reading.data(), analysisById.get(reading.id)),
  );
  return { profile, latestReading: recentReadings[0] ?? null, recentReadings };
}
