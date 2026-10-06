const UPSTREAM_PATH = "/api/symptoms/analyze-senior";
const REQUEST_TIMEOUT_MS = 60_000;

const BODY_PARTS = new Set([
  "Head",
  "Chest",
  "Lower Back",
  "Knees",
  "Stomach",
  "Neck",
  "Shoulders",
  "Hands/Wrists",
  "Legs/Ankles",
]);
const PAIN_SENSATIONS = new Set([
  "Dull ache",
  "Sharp / Stabbing",
  "Throbbing",
  "Burning",
  "Tingling / Numbness",
  "Cramping",
]);
const DURATIONS = new Set([
  "Just started today",
  "2–3 days",
  "About a week",
  "A few weeks",
  "Months or longer",
]);
const GENDERS = new Set(["Female", "Male", "Other / Prefer not to say"]);
const URGENCY_COLORS: Record<string, string> = {
  Routine: "green",
  "See a doctor soon": "yellow",
  "Seek immediate attention": "red",
};

type RuntimeEnv = Record<string, unknown>;

export async function handleAnalyzeSeniorSymptoms(
  request: Request,
  env: unknown,
): Promise<Response> {
  if (request.method !== "POST") {
    return json({ message: "Unsupported method." }, 405, { allow: "POST" });
  }
  if (!isSameOrigin(request)) return json({ message: "Request origin is not allowed." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ message: "Expected a JSON request." }, 415);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ message: "Check the symptom details and try again." }, 400);
  }
  if (!isValidRequest(payload)) {
    return json({ message: "Check the symptom details and try again." }, 400);
  }

  const upstreamUrl = getUpstreamUrl(env);
  if (!upstreamUrl) {
    return json({ message: "Symptom analysis is temporarily unavailable." }, 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!upstream.ok) {
      return json(
        { message: "Symptom analysis is temporarily unavailable. Please try again." },
        upstream.status >= 500 ? 502 : upstream.status,
      );
    }

    let result: unknown;
    try {
      result = await upstream.json();
    } catch {
      return json({ message: "The analysis service returned an incomplete result." }, 502);
    }
    if (!isValidResponse(result)) {
      return json({ message: "The analysis service returned an incomplete result." }, 502);
    }
    return json(result);
  } catch {
    return json({ message: "Symptom analysis is temporarily unavailable. Please try again." }, 502);
  } finally {
    clearTimeout(timeout);
  }
}

function isValidRequest(value: unknown): value is Record<string, unknown> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return false;
  const payload = value as Record<string, unknown>;
  const requiredKeys = [
    "body_parts",
    "pain_sensations",
    "pain_severity",
    "duration",
    "gender",
  ];
  const keys = Object.keys(payload);
  if (
    requiredKeys.some((key) => !Object.hasOwn(payload, key)) ||
    keys.some((key) => ![...requiredKeys, "age"].includes(key)) ||
    !isChoiceList(payload.body_parts, BODY_PARTS) ||
    !isChoiceList(payload.pain_sensations, PAIN_SENSATIONS) ||
    typeof payload.pain_severity !== "number" ||
    !Number.isInteger(payload.pain_severity) ||
    payload.pain_severity < 1 ||
    payload.pain_severity > 10 ||
    typeof payload.duration !== "string" ||
    !DURATIONS.has(payload.duration) ||
    typeof payload.gender !== "string" ||
    !GENDERS.has(payload.gender)
  ) {
    return false;
  }
  return (
    !Object.hasOwn(payload, "age") ||
    (typeof payload.age === "number" &&
      Number.isInteger(payload.age) &&
      payload.age >= 1 &&
      payload.age <= 120)
  );
}

function isChoiceList(value: unknown, validChoices: Set<string>): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((choice) => typeof choice === "string" && validChoices.has(choice))
  );
}

function isValidResponse(value: unknown): value is Record<string, unknown> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return false;
  const result = value as Record<string, unknown>;
  return (
    result.urgency_badge_color === URGENCY_COLORS[result.urgency as string] &&
    typeof result.summary === "string" &&
    Array.isArray(result.possible_conditions) &&
    result.possible_conditions.every(
      (item) =>
        item != null &&
        typeof item === "object" &&
        typeof (item as Record<string, unknown>).name === "string" &&
        typeof (item as Record<string, unknown>).explanation === "string",
    ) &&
    Array.isArray(result.red_flags) &&
    result.red_flags.every((item) => typeof item === "string") &&
    Array.isArray(result.recommended_actions) &&
    result.recommended_actions.every((item) => typeof item === "string")
  );
}

function getUpstreamUrl(env: unknown): string | undefined {
  const configured = getConfig(env, "CAREAI_SYMPTOMS_API_URL");
  const defaultLocal =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production"
      ? "http://127.0.0.1:8000"
      : undefined;
  const base = configured ?? defaultLocal;
  if (!base) return undefined;

  try {
    const url = new URL(base);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return undefined;
    }
    url.pathname = `${url.pathname.replace(/\/$/, "")}${UPSTREAM_PATH}`;
    return url.toString();
  } catch {
    return undefined;
  }
}

function getConfig(env: unknown, key: string): string | undefined {
  const boundValue =
    env != null && typeof env === "object" ? (env as RuntimeEnv)[key] : undefined;
  if (typeof boundValue === "string" && boundValue.trim()) return boundValue.trim();
  const processValue = typeof process !== "undefined" ? process.env[key] : undefined;
  return processValue?.trim() || undefined;
}

function isSameOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  return origin == null || origin === new URL(request.url).origin;
}

function json(body: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}
