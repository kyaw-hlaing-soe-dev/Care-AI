import type { AiOutput } from "../types.js";

export const CAREAI_DISCLAIMER =
  "CareAI provides informational health insights and is not a substitute for professional medical advice.";
export const AI_UNAVAILABLE_MESSAGE =
  "Your reading was saved, but CareAI analysis is temporarily unavailable.";

const KEYS = new Set([
  "summary",
  "whatLooksGood",
  "areasToWatch",
  "recommendations",
  "urgency",
  "disclaimer",
]);
const UNSAFE = [
  /\byou (?:definitely )?have\b/i,
  /\bdiagnos(?:e|ed|is|ing)\b/i,
  /\byou are (?:definitely )?safe\b/i,
  /\b(?:definitely|guaranteed|certainly) safe\b/i,
  /\bthis proves\b/i,
  /\bprescrib(?:e|ed|ing)\b/i,
  /\b(?:stop|start|change|increase|decrease) (?:taking |using )?(?:your )?(?:medication|medicine|drug|dose|dosage)\b/i,
];

function text(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return normalized.length > 0 && normalized.length <= max
    ? normalized
    : undefined;
}

function list(value: unknown): string[] | undefined {
  if (!Array.isArray(value) || value.length > 3) return undefined;
  const normalized = value.map((item) => text(item, 240));
  return normalized.every((item): item is string => item !== undefined)
    ? normalized
    : undefined;
}

export function normalizeAiOutput(content: string): AiOutput | undefined {
  let value: unknown;
  try {
    value = JSON.parse(content.trim());
  } catch {
    return undefined;
  }
  if (value == null || typeof value !== "object" || Array.isArray(value))
    return undefined;
  const record = value as Record<string, unknown>;
  if (
    Object.keys(record).length !== KEYS.size ||
    Object.keys(record).some((key) => !KEYS.has(key))
  )
    return undefined;
  const summary = text(record.summary, 600);
  const whatLooksGood = list(record.whatLooksGood);
  const areasToWatch = list(record.areasToWatch);
  const recommendations = list(record.recommendations);
  const urgency = record.urgency;
  if (
    !summary ||
    !whatLooksGood ||
    !areasToWatch ||
    !recommendations ||
    (urgency !== "routine" &&
      urgency !== "monitor" &&
      urgency !== "seek-care") ||
    typeof record.disclaimer !== "string"
  )
    return undefined;
  if (
    [summary, ...whatLooksGood, ...areasToWatch, ...recommendations].some(
      (item) => UNSAFE.some((pattern) => pattern.test(item)),
    )
  )
    return undefined;
  return {
    summary,
    whatLooksGood,
    areasToWatch,
    recommendations,
    urgency,
    disclaimer: CAREAI_DISCLAIMER,
  };
}
