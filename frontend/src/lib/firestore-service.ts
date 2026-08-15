import {
  Timestamp,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseAuth, getFirestoreDatabase } from "./firebase-client";
import type { ProfileInput, UserProfile } from "./profile-context";
import { analyzeVitals, type VitalInput, type VitalRecord } from "./vitals";

export const CAREAI_DISCLAIMER =
  "CareAI provides informational health insights and is not a substitute for professional medical advice.";

const HISTORY_PAGE_SIZE = 20;
const DASHBOARD_LIMIT = 30;
const IDEMPOTENCY_KEY = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;
const VITAL_LIMITS: Record<keyof VitalInput, { min: number; max: number }> = {
  systolic: { min: 50, max: 300 },
  diastolic: { min: 30, max: 200 },
  heartRate: { min: 20, max: 250 },
  oxygen: { min: 50, max: 100 },
  temperature: { min: 30, max: 45 },
};

export class CareAiDataError extends Error {
  constructor(
    readonly code: "AUTH_ERROR" | "VALIDATION_ERROR" | "DATABASE_ERROR" | "PERMISSION_ERROR",
    message: string,
  ) {
    super(message);
  }
}

function authenticatedUid() {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) throw new CareAiDataError("AUTH_ERROR", "Please sign in again.");
  return uid;
}

function userDocument(uid: string) {
  return doc(getFirestoreDatabase(), "users", uid);
}

function vitalsCollection(uid: string) {
  return collection(userDocument(uid), "vitals");
}

function vitalDocument(uid: string, readingId: string) {
  return doc(vitalsCollection(uid), readingId);
}

function dateIso(value: unknown): string | null {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date && Number.isFinite(value.valueOf())) return value.toISOString();
  if (typeof value === "string" && Number.isFinite(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  return null;
}

function isProfileSex(value: unknown): value is UserProfile["sex"] {
  return value === "male" || value === "female" || value === "prefer-not-to-say";
}

function isBloodType(value: unknown): value is NonNullable<UserProfile["bloodType"]> {
  return ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"].includes(String(value));
}

function isPreferredLanguage(
  value: unknown,
): value is NonNullable<UserProfile["preferredLanguage"]> {
  return value === "en" || value === "my" || value === "zh-CN";
}

function mapProfile(data: DocumentData | undefined): UserProfile | null {
  if (!data || data.profileCompleted !== true) return null;
  const createdAt = dateIso(data.createdAt);
  const updatedAt = dateIso(data.updatedAt);
  if (
    typeof data.displayName !== "string" ||
    typeof data.dateOfBirth !== "string" ||
    !isProfileSex(data.sex) ||
    typeof data.heightCm !== "number" ||
    typeof data.weightKg !== "number" ||
    !createdAt ||
    !updatedAt
  ) {
    throw new CareAiDataError("DATABASE_ERROR", "Your profile data could not be read.");
  }
  return {
    displayName: data.displayName,
    dateOfBirth: data.dateOfBirth,
    sex: data.sex,
    heightCm: data.heightCm,
    weightKg: data.weightKg,
    profileCompleted: true,
    createdAt,
    updatedAt,
    ...(isBloodType(data.bloodType) ? { bloodType: data.bloodType } : {}),
    ...(isPreferredLanguage(data.preferredLanguage)
      ? { preferredLanguage: data.preferredLanguage }
      : {}),
  };
}

export async function loadProfile(): Promise<UserProfile | null> {
  const uid = authenticatedUid();
  const snapshot = await getDoc(userDocument(uid));
  return snapshot.exists() ? mapProfile(snapshot.data()) : null;
}

export async function saveProfile(
  input: ProfileInput & { preferredLanguage?: UserProfile["preferredLanguage"] },
): Promise<UserProfile> {
  const uid = authenticatedUid();
  const reference = userDocument(uid);
  const database = getFirestoreDatabase();
  await runTransaction(database, async (transaction) => {
    const current = await transaction.get(reference);
    const existing = current.data();
    const preferredLanguage = input.preferredLanguage ?? existing?.preferredLanguage;
    transaction.set(reference, {
      displayName: input.displayName.trim(),
      dateOfBirth: input.dateOfBirth,
      sex: input.sex,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      profileCompleted: true,
      createdAt: current.exists() ? existing?.createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...(input.bloodType ? { bloodType: input.bloodType } : {}),
      ...(isPreferredLanguage(preferredLanguage) ? { preferredLanguage } : {}),
    });
  });
  const saved = await loadProfile();
  if (!saved) throw new CareAiDataError("DATABASE_ERROR", "Your profile was not saved.");
  return saved;
}

export async function savePreferredLanguage(
  preferredLanguage: UserProfile["preferredLanguage"],
): Promise<UserProfile> {
  if (!preferredLanguage) {
    throw new CareAiDataError("VALIDATION_ERROR", "Choose a supported language.");
  }
  const uid = authenticatedUid();
  await updateDoc(userDocument(uid), { preferredLanguage, updatedAt: serverTimestamp() });
  const saved = await loadProfile();
  if (!saved) throw new CareAiDataError("DATABASE_ERROR", "Your preference was not saved.");
  return saved;
}

function sameVitalInput(data: DocumentData, input: VitalInput) {
  return (
    data.systolic === input.systolic &&
    data.diastolic === input.diastolic &&
    data.heartRate === input.heartRate &&
    data.oxygenSaturation === input.oxygen &&
    data.temperatureC === input.temperature
  );
}

export async function submitVitals(
  input: VitalInput,
  idempotencyKey: string,
): Promise<VitalRecord> {
  const uid = authenticatedUid();
  const key = idempotencyKey.trim();
  if (!IDEMPOTENCY_KEY.test(key)) {
    throw new CareAiDataError("VALIDATION_ERROR", "A valid submission key is required.");
  }
  for (const field of Object.keys(VITAL_LIMITS) as Array<keyof VitalInput>) {
    const value = input[field];
    const allowed = VITAL_LIMITS[field];
    if (!Number.isFinite(value) || value < allowed.min || value > allowed.max) {
      throw new CareAiDataError("VALIDATION_ERROR", "Check the highlighted values.");
    }
  }
  const reference = vitalDocument(uid, key);
  const analysis = analyzeVitals(input);
  await runTransaction(getFirestoreDatabase(), async (transaction) => {
    const existing = await transaction.get(reference);
    if (existing.exists()) {
      if (!sameVitalInput(existing.data(), input)) {
        throw new CareAiDataError(
          "VALIDATION_ERROR",
          "This submission key was already used for different readings.",
        );
      }
      return;
    }
    transaction.set(reference, {
      systolic: input.systolic,
      diastolic: input.diastolic,
      heartRate: input.heartRate,
      oxygenSaturation: input.oxygen,
      temperatureC: input.temperature,
      healthScore: analysis.score,
      status: analysis.status,
      emergency: analysis.emergency,
      urgency: analysis.emergency
        ? "seek-care"
        : analysis.status === "Good"
          ? "routine"
          : "monitor",
      algorithmVersion: "v1",
      analysisStatus: "unavailable",
      idempotencyKey: key,
      createdAt: serverTimestamp(),
    });
  });
  const snapshot = await getDoc(reference);
  if (!snapshot.exists()) {
    throw new CareAiDataError("DATABASE_ERROR", "Your reading was not saved.");
  }
  return mapReading(snapshot.id, snapshot.data());
}

export async function loadDashboard(): Promise<{
  records: VitalRecord[];
  latest: VitalRecord | undefined;
}> {
  const uid = authenticatedUid();
  const snapshot = await getDocs(
    query(vitalsCollection(uid), orderBy("createdAt", "desc"), limit(DASHBOARD_LIMIT)),
  );
  const records = snapshot.docs.map((item) => mapReading(item.id, item.data()));
  return { records, latest: records[0] };
}

type HistoryPeriod = "all" | "7d" | "30d";

export async function loadHistory(
  period: HistoryPeriod,
  cursor?: string,
): Promise<{ records: VitalRecord[]; nextCursor: string | null }> {
  const uid = authenticatedUid();
  const constraints: QueryConstraint[] = [
    orderBy("createdAt", "desc"),
    orderBy(documentId(), "desc"),
  ];
  if (period !== "all") {
    const days = period === "7d" ? 7 : 30;
    constraints.unshift(
      where("createdAt", ">=", Timestamp.fromMillis(Date.now() - days * 86_400_000)),
    );
  }
  if (cursor) {
    const parsed = parseCursor(cursor);
    constraints.push(startAfter(Timestamp.fromMillis(parsed.milliseconds), parsed.id));
  }
  constraints.push(limit(HISTORY_PAGE_SIZE + 1));
  const snapshot = await getDocs(query(vitalsCollection(uid), ...constraints));
  const page = snapshot.docs.slice(0, HISTORY_PAGE_SIZE);
  return {
    records: page.map((item) => mapReading(item.id, item.data())),
    nextCursor:
      snapshot.size > HISTORY_PAGE_SIZE && page.length
        ? createCursor(page[page.length - 1]!)
        : null,
  };
}

export async function loadReading(id: string): Promise<VitalRecord> {
  if (!IDEMPOTENCY_KEY.test(id)) {
    throw new CareAiDataError("VALIDATION_ERROR", "Reading not found.");
  }
  const snapshot = await getDoc(vitalDocument(authenticatedUid(), id));
  if (!snapshot.exists()) throw new CareAiDataError("PERMISSION_ERROR", "Reading not found.");
  return mapReading(snapshot.id, snapshot.data());
}

function createCursor(snapshot: QueryDocumentSnapshot<DocumentData>) {
  const createdAt = snapshot.get("createdAt");
  if (!(createdAt instanceof Timestamp)) {
    throw new CareAiDataError("DATABASE_ERROR", "History cursor data is invalid.");
  }
  return `${createdAt.toMillis()}:${snapshot.id}`;
}

function parseCursor(cursor: string) {
  const separator = cursor.indexOf(":");
  const milliseconds = Number(cursor.slice(0, separator));
  const id = cursor.slice(separator + 1);
  if (separator < 1 || !Number.isSafeInteger(milliseconds) || !IDEMPOTENCY_KEY.test(id)) {
    throw new CareAiDataError("VALIDATION_ERROR", "History cursor is invalid.");
  }
  return { milliseconds, id };
}

function mapReading(id: string, data: DocumentData): VitalRecord {
  const recordedAt = dateIso(data.createdAt);
  const input: VitalInput = {
    systolic: Number(data.systolic),
    diastolic: Number(data.diastolic),
    heartRate: Number(data.heartRate),
    oxygen: Number(data.oxygenSaturation),
    temperature: Number(data.temperatureC),
  };
  if (!recordedAt || Object.values(input).some((value) => !Number.isFinite(value))) {
    throw new CareAiDataError("DATABASE_ERROR", "A stored reading could not be read.");
  }
  const deterministic = analyzeVitals(input);
  return {
    id,
    recordedAt,
    ...input,
    analysis: {
      ...deterministic,
      aiStatus: "unavailable",
      urgency: deterministic.emergency
        ? "seek-care"
        : deterministic.status === "Good"
          ? "routine"
          : "monitor",
      provider: "deterministic",
      disclaimer: CAREAI_DISCLAIMER,
    },
  };
}
