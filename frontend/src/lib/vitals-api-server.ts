import { analyzeVitals, type VitalAnalysis, type VitalInput, type VitalRecord } from "./vitals";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.5-flash";
const DISCLAIMER =
  "CareAI offers informational insights and is not a substitute for professional medical advice.";
const LIMITS = {
  systolic: { min: 50, max: 300 },
  diastolic: { min: 30, max: 200 },
  heartRate: { min: 20, max: 250 },
  oxygen: { min: 50, max: 100 },
  temperature: { min: 30, max: 45 },
} as const satisfies Record<keyof VitalInput, { min: number; max: number }>;

type AnalyzeVitalsResponse = {
  reading: VitalRecord;
  healthScore: number;
  analysis: VitalAnalysis;
};

type RuntimeEnv = Record<string, unknown>;
type AiOutput = {
  summary: string;
  whatLooksGood: string[];
  areasToWatch: string[];
  recommendations: string[];
  urgency: "routine" | "monitor" | "seek-care";
  disclaimer: string;
};

export async function handleAnalyzeVitals(request: Request, env: unknown): Promise<Response> {
  if (request.method !== "POST") {
    return json({ code: "VALIDATION_ERROR", message: "Unsupported method." }, 405);
  }

  const input = await readVitalInput(request);
  if (!input.ok) {
    return json({ code: "VALIDATION_ERROR", message: "Check the highlighted values." }, 400);
  }

  const baseline = analyzeVitals(input.value);
  const reading: VitalRecord = {
    ...input.value,
    id: crypto.randomUUID(),
    recordedAt: new Date().toISOString(),
    analysis: { ...baseline, aiStatus: "failed" },
  };

  const aiAnalysis = await requestAiAnalysis(input.value, baseline, env);
  if (aiAnalysis) {
    reading.analysis = aiAnalysis;
  }

  const body: AnalyzeVitalsResponse = {
    reading,
    healthScore: reading.analysis.score,
    analysis: reading.analysis,
  };
  return json(body);
}

async function readVitalInput(
  request: Request,
): Promise<{ ok: true; value: VitalInput } | { ok: false }> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return { ok: false };
  }

  if (payload == null || typeof payload !== "object" || Array.isArray(payload))
    return { ok: false };
  const record = payload as Record<string, unknown>;
  const allowedKeys = new Set(Object.keys(LIMITS));
  if (Object.keys(record).some((key) => !allowedKeys.has(key))) return { ok: false };

  const value = {} as VitalInput;
  for (const key of Object.keys(LIMITS) as Array<keyof VitalInput>) {
    const raw = record[key];
    const limit = LIMITS[key];
    if (typeof raw !== "number" || !Number.isFinite(raw) || raw < limit.min || raw > limit.max) {
      return { ok: false };
    }
    value[key] = raw;
  }
  return { ok: true, value };
}

async function requestAiAnalysis(
  input: VitalInput,
  baseline: VitalAnalysis,
  env: unknown,
): Promise<VitalAnalysis | undefined> {
  const apiKey = getConfig(env, "OPENROUTER_API_KEY");
  if (!apiKey) return undefined;

  const model = getConfig(env, "OPENROUTER_MODEL") ?? DEFAULT_MODEL;
  const siteUrl = getConfig(env, "OPENROUTER_SITE_URL");
  const appName = getConfig(env, "OPENROUTER_APP_NAME") ?? "CareAI";
  const headers = new Headers({
    authorization: `Bearer ${apiKey}`,
    "content-type": "application/json",
    "x-title": appName,
  });
  if (siteUrl) headers.set("http-referer", siteUrl);

  const body = JSON.stringify({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are CareAI. Return only valid JSON matching this schema: summary string, whatLooksGood string[], areasToWatch string[], recommendations string[], urgency routine|monitor|seek-care, disclaimer string. Use 0-3 concise items per array. Do not include markdown.",
      },
      {
        role: "user",
        content: JSON.stringify({
          vitals: input,
          requiredDisclaimer: DISCLAIMER,
        }),
      },
    ],
    temperature: 0.2,
    max_tokens: 700,
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetchWithTimeout(
        OPENROUTER_URL,
        { method: "POST", headers, body },
        10_000,
      );
      if (!response.ok) {
        if (attempt === 0 && response.status >= 500) continue;
        return undefined;
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: unknown } }>;
      };
      const content = payload.choices?.[0]?.message?.content;
      if (typeof content !== "string") return undefined;
      const normalized = normalizeAiOutput(content);
      if (!normalized) return undefined;
      return {
        ...baseline,
        aiStatus: "completed",
        urgency: normalized.urgency,
        disclaimer: normalized.disclaimer,
        status: normalized.urgency === "seek-care" ? "Urgent" : baseline.status,
        emergency: normalized.urgency === "seek-care" || baseline.emergency,
        summary: normalized.summary,
        good: normalized.whatLooksGood,
        concerns: normalized.areasToWatch,
        recommendations: normalized.recommendations,
      };
    } catch {
      if (attempt === 0) continue;
      return undefined;
    }
  }

  return undefined;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeAiOutput(content: string): AiOutput | undefined {
  try {
    const parsed = JSON.parse(stripCodeFence(content)) as Partial<AiOutput>;
    const urgencyValues = new Set(["routine", "monitor", "seek-care"]);
    if (
      typeof parsed.summary !== "string" ||
      typeof parsed.disclaimer !== "string" ||
      typeof parsed.urgency !== "string" ||
      !urgencyValues.has(parsed.urgency) ||
      !isStringArray(parsed.whatLooksGood) ||
      !isStringArray(parsed.areasToWatch) ||
      !isStringArray(parsed.recommendations)
    ) {
      return undefined;
    }

    return {
      summary: parsed.summary.trim(),
      whatLooksGood: parsed.whatLooksGood
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3),
      areasToWatch: parsed.areasToWatch
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3),
      recommendations: parsed.recommendations
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3),
      urgency: parsed.urgency,
      disclaimer: parsed.disclaimer.includes("not a substitute for professional medical advice")
        ? parsed.disclaimer.trim()
        : DISCLAIMER,
    };
  } catch {
    return undefined;
  }
}

function stripCodeFence(content: string): string {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.length <= 3 && value.every((item) => typeof item === "string")
  );
}

function getConfig(env: unknown, key: string): string | undefined {
  const fromEnv = env != null && typeof env === "object" ? (env as RuntimeEnv)[key] : undefined;
  if (typeof fromEnv === "string" && fromEnv.trim()) return fromEnv.trim();
  const fromProcess = typeof process !== "undefined" ? process.env[key] : undefined;
  return fromProcess?.trim() || undefined;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
