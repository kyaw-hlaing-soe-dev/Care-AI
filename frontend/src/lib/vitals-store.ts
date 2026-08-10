import { analyzeVitals, type VitalInput, type VitalRecord } from "./vitals";

const KEY = "aicare.vitals.v1";

function read(): VitalRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as VitalRecord[]) : [];
  } catch {
    return [];
  }
}

function write(records: VitalRecord[]) {
  window.localStorage.setItem(KEY, JSON.stringify(records));
  window.dispatchEvent(new Event("aicare:vitals"));
}

/** Newest first. */
export function listVitals(limit?: number): VitalRecord[] {
  const all = read().sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  );
  return typeof limit === "number" ? all.slice(0, limit) : all;
}

export function getVital(id: string): VitalRecord | undefined {
  return read().find((r) => r.id === id);
}

export function createVital(input: VitalInput): VitalRecord {
  const record: VitalRecord = {
    ...input,
    id: crypto.randomUUID(),
    recordedAt: new Date().toISOString(),
    analysis: analyzeVitals(input),
  };
  write([record, ...read()]);
  return record;
}

export async function createVitalWithAi(
  input: VitalInput,
  idempotencyKey = crypto.randomUUID(),
): Promise<VitalRecord> {
  const response = await fetch("/api/vitals/analyze", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "idempotency-key": idempotencyKey,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Vitals analysis request failed.");
  }

  const payload = (await response.json()) as unknown;
  if (!isAnalyzeResponse(payload)) {
    throw new Error("Vitals analysis response was malformed.");
  }

  write([payload.reading, ...read()]);
  return payload.reading;
}

function isAnalyzeResponse(value: unknown): value is { reading: VitalRecord } {
  if (value == null || typeof value !== "object") return false;
  const reading = (value as { reading?: unknown }).reading;
  if (reading == null || typeof reading !== "object") return false;
  const record = reading as Partial<VitalRecord>;
  return (
    typeof record.id === "string" &&
    typeof record.recordedAt === "string" &&
    typeof record.systolic === "number" &&
    typeof record.diastolic === "number" &&
    typeof record.heartRate === "number" &&
    typeof record.oxygen === "number" &&
    typeof record.temperature === "number" &&
    record.analysis != null &&
    typeof record.analysis === "object" &&
    typeof record.analysis.summary === "string" &&
    typeof record.analysis.score === "number"
  );
}

export function subscribeVitals(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("aicare:vitals", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("aicare:vitals", cb);
    window.removeEventListener("storage", cb);
  };
}
