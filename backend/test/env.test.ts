import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_ALLOWED_ORIGINS,
  isAllowedOrigin,
  parseAllowedOrigins,
} from "../src/config/env.js";

test("the default CORS allowlist includes the production and local origins", () => {
  assert.deepEqual(DEFAULT_ALLOWED_ORIGINS, [
    "https://care-ai-six.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ]);
});

test("origin parsing trims entries and exact matching rejects lookalikes", () => {
  const origins = parseAllowedOrigins(
    " https://care-ai-six.vercel.app, ,http://localhost:5173 ",
  );

  assert.equal(isAllowedOrigin("https://care-ai-six.vercel.app", origins), true);
  assert.equal(isAllowedOrigin("https://care-ai-six.vercel.app.evil.example", origins), false);
  assert.equal(isAllowedOrigin("https://preview-care-ai-six.vercel.app", origins), false);
});
