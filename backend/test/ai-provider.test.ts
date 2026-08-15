import assert from "node:assert/strict";
import test from "node:test";
import { requestOpenRouter } from "../src/providers/openRouterProvider.js";
import { analyzeVitals } from "../src/services/healthScoreService.js";
import {
  CAREAI_DISCLAIMER,
  normalizeAiOutput,
} from "../src/validators/aiOutputValidator.js";

const input = {
  systolic: 120,
  diastolic: 80,
  heartRate: 72,
  oxygenSaturation: 98,
  temperatureC: 36.7,
};
const output = {
  summary: "The readings are within the app's typical ranges.",
  whatLooksGood: ["Oxygen is within the app's typical range."],
  areasToWatch: [],
  recommendations: ["Continue tracking consistently."],
  urgency: "routine",
  disclaimer: CAREAI_DISCLAIMER,
} as const;
const config = {
  apiKey: "test-only",
  model: "test/model",
  appName: "CareAI Test",
};

test("normalizer enforces exact safe schema", () => {
  assert.equal(
    normalizeAiOutput(JSON.stringify(output))?.disclaimer,
    CAREAI_DISCLAIMER,
  );
  assert.equal(
    normalizeAiOutput(JSON.stringify({ ...output, diagnosis: "extra" })),
    undefined,
  );
  assert.equal(
    normalizeAiOutput(
      JSON.stringify({
        ...output,
        summary: "You definitely have hypertension.",
      }),
    ),
    undefined,
  );
});

test("provider sends minimal context and preserves urgency", async () => {
  let requestBody = "";
  const fetchImpl = async (
    _url: string | URL | Request,
    init?: RequestInit,
  ) => {
    requestBody = String(init?.body);
    return new Response(
      JSON.stringify({
        choices: [{ message: { content: JSON.stringify(output) } }],
      }),
      { status: 200 },
    );
  };
  const result = await requestOpenRouter(
    input,
    analyzeVitals(input),
    config,
    fetchImpl,
  );
  assert.equal(result.ok, true);
  const context = JSON.parse(
    JSON.parse(requestBody).messages[1].content,
  ) as Record<string, unknown>;
  assert.deepEqual(Object.keys(context).sort(), [
    "applicationUrgency",
    "diastolic",
    "healthScore",
    "heartRate",
    "oxygenSaturation",
    "systolic",
    "temperatureC",
  ]);
  assert.equal(requestBody.includes("test-only"), false);
});

test("provider retries 5xx once and rejects urgency conflicts", async () => {
  let calls = 0;
  const retryFetch = async () =>
    ++calls === 1
      ? new Response("no", { status: 503 })
      : new Response(
          JSON.stringify({
            choices: [{ message: { content: JSON.stringify(output) } }],
          }),
        );
  assert.equal(
    (await requestOpenRouter(input, analyzeVitals(input), config, retryFetch))
      .ok,
    true,
  );
  assert.equal(calls, 2);
  const conflict = { ...output, urgency: "seek-care" };
  const result = await requestOpenRouter(
    input,
    analyzeVitals(input),
    config,
    async () =>
      new Response(
        JSON.stringify({
          choices: [{ message: { content: JSON.stringify(conflict) } }],
        }),
      ),
  );
  assert.equal(result.ok, false);
});

test("provider fails safely without server configuration", async () => {
  let called = false;
  const result = await requestOpenRouter(
    input,
    analyzeVitals(input),
    { apiKey: "", model: "", appName: "CareAI Test" },
    async () => {
      called = true;
      return new Response();
    },
  );
  assert.deepEqual(result, { ok: false, retryable: false, model: "" });
  assert.equal(called, false);
});
