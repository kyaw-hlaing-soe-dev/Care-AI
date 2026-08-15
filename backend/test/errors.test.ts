import assert from "node:assert/strict";
import test from "node:test";
import { AppError, toAppError } from "../src/utils/errors.js";

test("preserves safe application errors", () => {
  const error = new AppError("AUTH_ERROR", 401);
  assert.equal(toAppError(error), error);
});

test("maps malformed or oversized JSON bodies to validation errors", () => {
  for (const status of [400, 413] as const) {
    const error = toAppError({ status, type: "entity.parse.failed" });
    assert.equal(error.code, "VALIDATION_ERROR");
    assert.equal(error.status, status);
    assert.equal(error.message, "Check the request body and try again.");
  }
});

test("keeps unknown internal failures generic", () => {
  const error = toAppError(new Error("private detail"));
  assert.equal(error.code, "DATABASE_ERROR");
  assert.equal(error.status, 500);
  assert.equal(error.message.includes("private detail"), false);
});
