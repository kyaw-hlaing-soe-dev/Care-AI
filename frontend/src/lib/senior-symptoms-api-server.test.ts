import assert from "node:assert/strict";
import test from "node:test";
import { handleAnalyzeSeniorSymptoms } from "./senior-symptoms-api-server";

const validInput = {
  body_parts: ["Knees"],
  pain_sensations: ["Dull ache"],
  pain_severity: 5,
  duration: "2–3 days",
  gender: "Other / Prefer not to say",
};

const validOutput = {
  urgency: "See a doctor soon",
  urgency_badge_color: "yellow",
  summary: "Consider discussing this pain with a health professional.",
  possible_conditions: [{ name: "Joint strain", explanation: "This can sometimes cause knee discomfort." }],
  red_flags: ["Sudden severe weakness"],
  recommended_actions: ["Seek medical advice if the pain continues."],
};

test("proxies a valid senior symptom request to FastAPI", async () => {
  const originalFetch = globalThis.fetch;
  let forwardedUrl = "";
  let forwardedBody = "";
  globalThis.fetch = (async (input, init) => {
    forwardedUrl = String(input);
    forwardedBody = String(init?.body);
    return new Response(JSON.stringify(validOutput), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  try {
    const request = new Request("https://careai.example/api/symptoms/analyze-senior", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://careai.example",
      },
      body: JSON.stringify(validInput),
    });
    const response = await handleAnalyzeSeniorSymptoms(request, {
      CAREAI_SYMPTOMS_API_URL: "https://symptoms.example",
    });

    assert.equal(response.status, 200);
    assert.equal(forwardedUrl, "https://symptoms.example/api/symptoms/analyze-senior");
    assert.deepEqual(JSON.parse(forwardedBody), validInput);
    assert.deepEqual(await response.json(), validOutput);
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects incomplete input without calling FastAPI", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalled = false;
  globalThis.fetch = (async () => {
    fetchCalled = true;
    return new Response("{}", { status: 200 });
  }) as typeof fetch;

  try {
    const request = new Request("https://careai.example/api/symptoms/analyze-senior", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://careai.example",
      },
      body: JSON.stringify({ ...validInput, pain_severity: 12 }),
    });
    const response = await handleAnalyzeSeniorSymptoms(request, {
      CAREAI_SYMPTOMS_API_URL: "https://symptoms.example",
    });

    assert.equal(response.status, 400);
    assert.equal(fetchCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
