import assert from "node:assert/strict";
import test from "node:test";
import { validateVitalInput } from "../src/validators/vitalValidator.js";
import { validateProfile } from "../src/validators/profileValidator.js";

const good = {
  systolic: 120,
  diastolic: 80,
  heartRate: 72,
  oxygenSaturation: 98,
  temperatureC: 36.7,
};

test("vital validator accepts exact valid shape", () =>
  assert.deepEqual(validateVitalInput(good), good));
test("vital validator rejects missing, extra, wrong type, and technical limits", () => {
  for (const value of [
    { ...good, email: "x@example.com" },
    { ...good, heartRate: "72" },
    { ...good, oxygenSaturation: 101 },
    { ...good, temperatureC: Number.NaN },
  ]) {
    assert.throws(() => validateVitalInput(value));
  }
});
test("profile validator rejects future dates and unknown fields", () => {
  const profile = {
    displayName: "Care User",
    dateOfBirth: "2000-01-01",
    sex: "prefer-not-to-say",
    heightCm: 170,
    weightKg: 65,
  };
  assert.equal(validateProfile(profile).displayName, "Care User");
  assert.throws(() =>
    validateProfile({ ...profile, dateOfBirth: "2999-01-01" }),
  );
  assert.throws(() =>
    validateProfile({ ...profile, email: "private@example.com" }),
  );
});
