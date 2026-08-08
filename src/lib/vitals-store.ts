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

export async function createVitalWithAi(input: VitalInput): Promise<VitalRecord> {
  const response = await fetch("/api/vitals/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Vitals analysis request failed.");
  }

  const payload = (await response.json()) as { reading?: VitalRecord };
  if (!payload.reading) {
    throw new Error("Vitals analysis response was malformed.");
  }

  write([payload.reading, ...read()]);
  return payload.reading;
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
