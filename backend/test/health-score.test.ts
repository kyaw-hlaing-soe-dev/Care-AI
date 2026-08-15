import assert from "node:assert/strict";
import test from "node:test";
import { analyzeVitals } from "../src/services/healthScoreService.js";

const good = {
  systolic: 120,
  diastolic: 80,
  heartRate: 72,
  oxygenSaturation: 98,
  temperatureC: 36.7,
};

test("score is deterministic and inclusive at reference boundaries", () => {
  assert.deepEqual(analyzeVitals(good), analyzeVitals(good));
  assert.equal(
    analyzeVitals({
      systolic: 90,
      diastolic: 60,
      heartRate: 60,
      oxygenSaturation: 95,
      temperatureC: 36.1,
    }).healthScore,
    100,
  );
  assert.equal(
    analyzeVitals({
      systolic: 120,
      diastolic: 80,
      heartRate: 100,
      oxygenSaturation: 100,
      temperatureC: 37.2,
    }).status,
    "Good",
  );
});

test("each deviation subtracts 12 and emergency subtracts 25", () => {
  assert.equal(analyzeVitals({ ...good, systolic: 121 }).healthScore, 88);
  const emergency = analyzeVitals({ ...good, oxygenSaturation: 89 });
  assert.equal(emergency.healthScore, 63);
  assert.equal(emergency.status, "Urgent");
  assert.equal(emergency.urgency, "seek-care");
});

test("all emergency thresholds are exact", () => {
  for (const input of [
    { ...good, temperatureC: 39.5 },
    { ...good, systolic: 180 },
    { ...good, diastolic: 120 },
    { ...good, heartRate: 130 },
    { ...good, heartRate: 40 },
    { ...good, oxygenSaturation: 89.9 },
  ])
    assert.equal(analyzeVitals(input).emergency, true);
});
