import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { afterEach, test } from "node:test";
import {
  AI_UNAVAILABLE_MESSAGE,
  CAREAI_DISCLAIMER,
  handleAnalyzeVitals,
  normalizeAiOutput,
  type AiOutput,
  type AnalyzeVitalsResponse,
} from "./vitals-api-server";

const ORIGINAL_FETCH = globalThis.fetch;

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto });
}

const ENV = {
  OPENROUTER_API_KEY: "test-key-not-a-secret",
  OPENROUTER_MODEL: "test/provider-model",
  OPENROUTER_SITE_URL: "https://careai.example",
  OPENROUTER_APP_NAME: "CareAI Test",
};
const GOOD_VITALS = {
  systolic: 120,
  diastolic: 80,
  heartRate: 72,
  oxygen: 98,
  temperature: 36.7,
};

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
});

function aiOutput(overrides: Partial<AiOutput> = {}): AiOutput {
  return {
    summary: "All supplied readings are within the app's typical reference ranges.",
    whatLooksGood: ["The supplied oxygen saturation is within the app's typical range."],
    areasToWatch: [],
    recommendations: ["Continue tracking readings consistently."],
    urgency: "routine",
    disclaimer: CAREAI_DISCLAIMER,
    ...overrides,
  };
}

function request(body: unknown = GOOD_VITALS, headers: Record<string, string> = {}): Request {
  return new Request("https://careai.example/api/vitals/analyze", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function providerResponse(output: AiOutput, status = 200): Response {
  return new Response(
    JSON.stringify({ choices: [{ message: { content: JSON.stringify(output) } }] }),
    { status, headers: { "content-type": "application/json" } },
  );
}

async function responseBody(response: Response): Promise<AnalyzeVitalsResponse> {
  return (await response.json()) as AnalyzeVitalsResponse;
}

test("normalizes the exact AI schema and replaces the provider disclaimer", () => {
  const normalized = normalizeAiOutput(
    JSON.stringify(aiOutput({ disclaimer: "Provider supplied wording." })),
  );

  assert.equal(normalized?.disclaimer, CAREAI_DISCLAIMER);
  assert.equal(normalized?.urgency, "routine");
  assert.deepEqual(normalized?.areasToWatch, []);
});

test("rejects malformed, overlong, extra, and unsafe provider output", () => {
  assert.equal(normalizeAiOutput("```json\n{}\n```"), undefined);
  assert.equal(
    normalizeAiOutput(
      JSON.stringify(aiOutput({ recommendations: ["one", "two", "three", "four"] })),
    ),
    undefined,
  );
  assert.equal(
    normalizeAiOutput(JSON.stringify({ ...aiOutput(), diagnosis: "extra field" })),
    undefined,
  );
  assert.equal(
    normalizeAiOutput(JSON.stringify(aiOutput({ summary: "You definitely have hypertension." }))),
    undefined,
  );
});

test("rejects malformed vital payloads before calling the provider", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return providerResponse(aiOutput());
  };

  const missing = await handleAnalyzeVitals(request({ ...GOOD_VITALS, oxygen: undefined }), ENV);
  const unexpected = await handleAnalyzeVitals(
    request({ ...GOOD_VITALS, email: "private@example.com" }),
    ENV,
  );
  const wrongType = await handleAnalyzeVitals(request({ ...GOOD_VITALS, heartRate: "72" }), ENV);

  assert.equal(missing.status, 400);
  assert.equal(unexpected.status, 400);
  assert.equal(wrongType.status, 400);
  assert.equal(calls, 0);
});

test("rejects cross-site and non-JSON requests", async () => {
  const crossSite = await handleAnalyzeVitals(
    request(GOOD_VITALS, { origin: "https://attacker.example" }),
    ENV,
  );
  const plainText = await handleAnalyzeVitals(
    new Request("https://careai.example/api/vitals/analyze", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify(GOOD_VITALS),
    }),
    ENV,
  );

  assert.equal(crossSite.status, 403);
  assert.equal(plainText.status, 415);
});

test("returns a saved reading with a safe fallback when AI is not configured", async () => {
  const response = await handleAnalyzeVitals(request(), {});
  const body = await responseBody(response);

  assert.equal(response.status, 200);
  assert.equal(body.analysisStatus, "failed");
  assert.equal(body.errorCode, "AI_ERROR");
  assert.equal(body.healthScore, 100);
  assert.equal(body.reading.analysis.summary, AI_UNAVAILABLE_MESSAGE);
  assert.equal(body.reading.analysis.status, "Good");
  assert.equal(body.reading.analysis.emergency, false);
  assert.equal(body.reading.analysis.disclaimer, CAREAI_DISCLAIMER);
});

test("sends only minimal health context and keeps deterministic results authoritative", async () => {
  let providerRequest: RequestInit | undefined;
  globalThis.fetch = async (_url, init) => {
    providerRequest = init;
    return providerResponse(aiOutput());
  };

  const response = await handleAnalyzeVitals(request(), ENV);
  const body = await responseBody(response);
  const providerBody = JSON.parse(String(providerRequest?.body)) as {
    messages: Array<{ content: string }>;
  };
  const context = JSON.parse(providerBody.messages[1]?.content ?? "{}") as Record<string, unknown>;

  assert.equal(body.analysisStatus, "completed");
  assert.equal(body.healthScore, 100);
  assert.equal(body.analysis.status, "Good");
  assert.equal(body.analysis.emergency, false);
  assert.equal(body.analysis.urgency, "routine");
  assert.equal(body.analysis.provider, "openrouter");
  assert.equal(body.analysis.model, ENV.OPENROUTER_MODEL);
  assert.deepEqual(Object.keys(context).sort(), [
    "applicationUrgency",
    "diastolic",
    "healthScore",
    "heartRate",
    "oxygenSaturation",
    "systolic",
    "temperatureC",
  ]);
  assert.equal(JSON.stringify(body).includes(ENV.OPENROUTER_API_KEY), false);
});

test("rejects provider urgency that conflicts with deterministic policy", async () => {
  globalThis.fetch = async () => providerResponse(aiOutput({ urgency: "seek-care" }));

  const body = await responseBody(await handleAnalyzeVitals(request(), ENV));

  assert.equal(body.analysisStatus, "failed");
  assert.equal(body.analysis.status, "Good");
  assert.equal(body.analysis.emergency, false);
  assert.equal(body.analysis.urgency, "routine");
});

test("retries one 5xx response and does not retry a 4xx response", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return calls === 1
      ? new Response("unavailable", { status: 503 })
      : providerResponse(aiOutput());
  };

  const recovered = await responseBody(await handleAnalyzeVitals(request(), ENV));
  assert.equal(calls, 2);
  assert.equal(recovered.analysisStatus, "completed");

  calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response("bad request", { status: 400 });
  };
  const failed = await responseBody(await handleAnalyzeVitals(request(), ENV));
  assert.equal(calls, 1);
  assert.equal(failed.analysisStatus, "failed");
});

test("reuses an idempotent response without a duplicate provider request", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return providerResponse(aiOutput());
  };
  const headers = { "idempotency-key": "test-idempotency-0001" };

  const first = await responseBody(await handleAnalyzeVitals(request(GOOD_VITALS, headers), ENV));
  const second = await responseBody(await handleAnalyzeVitals(request(GOOD_VITALS, headers), ENV));

  assert.equal(calls, 1);
  assert.equal(first.reading.id, second.reading.id);
});
