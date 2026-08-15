import type { AiOutput, DeterministicAnalysis, VitalInput } from "../types.js";
import {
  CAREAI_DISCLAIMER,
  normalizeAiOutput,
} from "../validators/aiOutputValidator.js";

const URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_BYTES = 128 * 1024;

export type OpenRouterConfig = {
  apiKey: string;
  model: string;
  siteUrl?: string;
  appName: string;
};
export type ProviderResult =
  | { ok: true; output: AiOutput; model: string }
  | { ok: false; retryable: boolean; model: string };

export async function requestOpenRouter(
  input: VitalInput,
  baseline: DeterministicAnalysis,
  config: OpenRouterConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<ProviderResult> {
  if (!config.apiKey.trim() || !config.model.trim()) {
    return { ok: false, retryable: false, model: config.model };
  }
  const headers = new Headers({
    authorization: `Bearer ${config.apiKey}`,
    "content-type": "application/json",
    "x-title": config.appName,
  });
  if (config.siteUrl) headers.set("http-referer", config.siteUrl);
  const body = JSON.stringify({
    model: config.model,
    messages: [
      { role: "system", content: systemPrompt() },
      {
        role: "user",
        content: JSON.stringify({
          ...input,
          healthScore: baseline.healthScore,
          applicationUrgency: baseline.urgency,
        }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
    max_tokens: 700,
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let response: Response;
    try {
      response = await withTimeout(
        fetchImpl,
        URL,
        { method: "POST", headers, body },
        10_000,
      );
    } catch {
      if (attempt === 0) continue;
      return { ok: false, retryable: true, model: config.model };
    }
    if (!response.ok) {
      const retryable = response.status >= 500;
      if (attempt === 0 && retryable) continue;
      return { ok: false, retryable, model: config.model };
    }
    const length = Number(response.headers.get("content-length"));
    if (Number.isFinite(length) && length > MAX_BYTES)
      return { ok: false, retryable: false, model: config.model };
    const raw = await response.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BYTES)
      return { ok: false, retryable: false, model: config.model };
    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return { ok: false, retryable: false, model: config.model };
    }
    const content = providerContent(payload);
    const output = content ? normalizeAiOutput(content) : undefined;
    if (!output || output.urgency !== baseline.urgency)
      return { ok: false, retryable: false, model: config.model };
    return { ok: true, output, model: config.model };
  }
  return { ok: false, retryable: true, model: config.model };
}

function systemPrompt(): string {
  return [
    "You are CareAI, an informational health insight assistant.",
    "Return only JSON with exactly summary, whatLooksGood, areasToWatch, recommendations, urgency, disclaimer.",
    "Lists contain zero to three concise strings; urgency is routine, monitor, or seek-care.",
    `The disclaimer must be exactly: ${CAREAI_DISCLAIMER}`,
    "The supplied score and urgency are authoritative. Do not diagnose, prescribe, discuss medication changes, claim certainty, or infer missing context.",
  ].join(" ");
}

function providerContent(value: unknown): string | undefined {
  if (value == null || typeof value !== "object") return undefined;
  const choices = (value as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return undefined;
  const first = choices[0] as { message?: { content?: unknown } } | undefined;
  const content = first?.message?.content;
  return typeof content === "string" && content.length <= 12_000
    ? content
    : undefined;
}

async function withTimeout(
  fetchImpl: typeof fetch,
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
