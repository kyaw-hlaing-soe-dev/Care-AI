import type { VitalAnalysis, VitalInput, VitalRecord } from "./vitals";

type ClientEnv = ImportMeta & {
  env?: {
    VITE_CAREAI_AI_ANALYSIS_ENABLED?: string;
  };
};

type AnalyzeVitalsResponse = {
  analysis?: VitalAnalysis;
  analysisStatus?: "completed" | "failed";
};

export function isOpenRouterAnalysisEnabled() {
  return (import.meta as ClientEnv).env?.VITE_CAREAI_AI_ANALYSIS_ENABLED === "true";
}

export async function createOpenRouterAnalysis(
  record: VitalRecord,
  signal?: AbortSignal,
): Promise<VitalAnalysis | null> {
  if (!isOpenRouterAnalysisEnabled() || typeof window === "undefined") return null;

  const response = await fetch("/api/vitals/analyze", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "idempotency-key": record.id,
    },
    body: JSON.stringify(toVitalInput(record)),
    signal,
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as Partial<AnalyzeVitalsResponse>;
  if (
    (payload.analysisStatus !== "completed" && payload.analysisStatus !== "failed") ||
    !payload.analysis
  ) {
    return null;
  }

  return {
    ...payload.analysis,
    status: record.analysis.status,
    emergency: record.analysis.emergency,
    score: record.analysis.score,
    urgency: record.analysis.urgency,
  };
}

export function mergeAiAnalysis(record: VitalRecord, analysis: VitalAnalysis | null): VitalRecord {
  return analysis ? { ...record, analysis } : record;
}

function toVitalInput(record: VitalRecord): VitalInput {
  return {
    temperature: record.temperature,
    systolic: record.systolic,
    diastolic: record.diastolic,
    heartRate: record.heartRate,
    oxygen: record.oxygen,
  };
}
