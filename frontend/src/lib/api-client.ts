import { firebaseAuth } from "./firebase-client";
import type { ProfileInput, UserProfile } from "./profile-context";
import type { VitalInput, VitalRecord } from "./vitals";

const API_BASE = String(import.meta.env["VITE_CAREAI_API_BASE_URL"] ?? "").replace(/\/$/, "");
export const CAREAI_DISCLAIMER =
  "CareAI provides informational health insights and is not a substitute for professional medical advice.";

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; requestId?: string } };

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new ApiError("AUTH_ERROR", "Please sign in again.", 401);
  if (!API_BASE) throw new ApiError("NETWORK_ERROR", "CareAI backend is not configured.", 503);
  const token = await user.getIdToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { accept: "application/json", authorization: `Bearer ${token}`, ...init.headers },
  });
  let payload: ApiEnvelope<T> | undefined;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    /* safe generic error below */
  }
  if (!response.ok || !payload || !payload.success) {
    const failure = payload && !payload.success ? payload.error : undefined;
    throw new ApiError(
      failure?.code ?? "NETWORK_ERROR",
      failure?.message ?? "We couldn't complete the request.",
      response.status,
    );
  }
  return payload.data;
}

export async function loadProfile(): Promise<UserProfile | null> {
  return (await apiRequest<{ profile: UserProfile | null }>("/profile")).profile;
}

export async function saveProfile(
  input: ProfileInput & { preferredLanguage?: UserProfile["preferredLanguage"] },
): Promise<UserProfile> {
  return (
    await apiRequest<{ profile: UserProfile }>("/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    })
  ).profile;
}

export async function savePreferredLanguage(
  preferredLanguage: UserProfile["preferredLanguage"],
): Promise<UserProfile> {
  return (
    await apiRequest<{ profile: UserProfile }>("/profile/preferences", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ preferredLanguage }),
    })
  ).profile;
}

export async function submitVitals(
  input: VitalInput,
  idempotencyKey: string,
): Promise<VitalRecord> {
  const data = await apiRequest<{ reading: ApiReading }>("/vitals/analyze", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
    body: JSON.stringify({
      systolic: input.systolic,
      diastolic: input.diastolic,
      heartRate: input.heartRate,
      oxygenSaturation: input.oxygen,
      temperatureC: input.temperature,
    }),
  });
  return mapReading(data.reading);
}

export async function loadDashboard(): Promise<{
  records: VitalRecord[];
  latest: VitalRecord | undefined;
}> {
  const data = await apiRequest<{ recentReadings: ApiReading[]; latestReading: ApiReading | null }>(
    "/dashboard",
  );
  const records = data.recentReadings.map(mapReading);
  return { records, latest: records[0] };
}

export async function loadHistory(
  period: "all" | "7d" | "30d",
  cursor?: string,
): Promise<{ records: VitalRecord[]; nextCursor: string | null }> {
  const params = new URLSearchParams({ period, pageSize: "20" });
  if (cursor) params.set("cursor", cursor);
  const data = await apiRequest<{ records: ApiReading[]; nextCursor: string | null }>(
    `/history?${params}`,
  );
  return { records: data.records.map(mapReading), nextCursor: data.nextCursor };
}

export async function loadReading(id: string): Promise<VitalRecord> {
  const data = await apiRequest<{ reading: ApiReading }>(`/history/${encodeURIComponent(id)}`);
  return mapReading(data.reading);
}

type ApiAnalysis = {
  summary?: unknown;
  whatLooksGood?: unknown;
  areasToWatch?: unknown;
  recommendations?: unknown;
  disclaimer?: unknown;
  provider?: unknown;
  model?: unknown;
};
type ApiReading = {
  id: string;
  createdAt: unknown;
  systolic: unknown;
  diastolic: unknown;
  heartRate: unknown;
  oxygenSaturation: unknown;
  temperatureC: unknown;
  status: unknown;
  analysisStatus: unknown;
  urgency: unknown;
  emergency: unknown;
  healthScore: unknown;
  analysis?: ApiAnalysis | null;
};

function mapReading(reading: ApiReading): VitalRecord {
  const analysis = reading.analysis ?? {};
  const analysisStatus =
    reading.analysisStatus === "completed"
      ? "completed"
      : reading.analysisStatus === "failed"
        ? "failed"
        : "pending";
  const status =
    reading.status === "Good" ||
    reading.status === "Attention Needed" ||
    reading.status === "Urgent"
      ? reading.status
      : "Pending";
  const urgency =
    reading.urgency === "routine" ||
    reading.urgency === "monitor" ||
    reading.urgency === "seek-care"
      ? reading.urgency
      : "monitor";
  return {
    id: reading.id,
    recordedAt: String(reading.createdAt),
    systolic: Number(reading.systolic),
    diastolic: Number(reading.diastolic),
    heartRate: Number(reading.heartRate),
    oxygen: Number(reading.oxygenSaturation),
    temperature: Number(reading.temperatureC),
    analysis: {
      status,
      aiStatus: analysisStatus,
      urgency,
      emergency: Boolean(reading.emergency),
      score: Number(reading.healthScore),
      summary: String(
        analysis.summary ?? "Your reading was saved. CareAI analysis is still processing.",
      ),
      good: Array.isArray(analysis.whatLooksGood) ? (analysis.whatLooksGood as string[]) : [],
      concerns: Array.isArray(analysis.areasToWatch) ? (analysis.areasToWatch as string[]) : [],
      recommendations: Array.isArray(analysis.recommendations)
        ? (analysis.recommendations as string[])
        : [],
      disclaimer: String(analysis.disclaimer ?? CAREAI_DISCLAIMER),
      ...(analysis.provider === "openrouter" ? { provider: "openrouter" as const } : {}),
      ...(typeof analysis.model === "string" ? { model: analysis.model } : {}),
    },
  };
}
