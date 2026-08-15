import type { DeterministicAnalysis, VitalInput } from "../types.js";

type RangeKey = keyof VitalInput;
const RANGES: Record<
  RangeKey,
  { min: number; max: number; label: string; unit: string }
> = {
  temperatureC: { min: 36.1, max: 37.2, label: "Temperature", unit: "°C" },
  systolic: { min: 90, max: 120, label: "Systolic pressure", unit: "mmHg" },
  diastolic: { min: 60, max: 80, label: "Diastolic pressure", unit: "mmHg" },
  heartRate: { min: 60, max: 100, label: "Heart rate", unit: "bpm" },
  oxygenSaturation: {
    min: 95,
    max: 100,
    label: "Oxygen saturation",
    unit: "%",
  },
};

export function analyzeVitals(input: VitalInput): DeterministicAnalysis {
  const whatLooksGood: string[] = [];
  const areasToWatch: string[] = [];
  const recommendations: string[] = [];
  let deviations = 0;

  for (const key of Object.keys(RANGES) as RangeKey[]) {
    const value = input[key];
    const range = RANGES[key];
    if (value >= range.min && value <= range.max) {
      whatLooksGood.push(
        `${range.label} is within the typical range at ${value}${range.unit}.`,
      );
    } else {
      deviations += 1;
      areasToWatch.push(
        `${range.label} is ${value < range.min ? "below" : "above"} the typical range at ${value}${range.unit}.`,
      );
    }
  }

  const emergency =
    input.oxygenSaturation < 90 ||
    input.temperatureC >= 39.5 ||
    input.systolic >= 180 ||
    input.diastolic >= 120 ||
    input.heartRate >= 130 ||
    input.heartRate <= 40;

  if (input.temperatureC > RANGES.temperatureC.max)
    recommendations.push(
      "Rest, hydrate frequently, and re-check your temperature in a few hours.",
    );
  if (
    input.systolic > RANGES.systolic.max ||
    input.diastolic > RANGES.diastolic.max
  )
    recommendations.push(
      "Reduce salt intake, avoid caffeine today, and re-measure while seated and calm.",
    );
  if (input.heartRate > RANGES.heartRate.max)
    recommendations.push(
      "Sit down for five minutes of slow breathing, then take the reading again.",
    );
  if (input.oxygenSaturation < RANGES.oxygenSaturation.min)
    recommendations.push(
      "Sit upright, breathe deeply, and monitor your oxygen level closely.",
    );
  if (recommendations.length === 0)
    recommendations.push(
      "Keep your current routine — steady sleep, movement, and hydration are working.",
    );
  recommendations.push(
    "Log your vitals at the same time each day for a more accurate trend.",
  );

  const status = emergency
    ? "Urgent"
    : deviations === 0
      ? "Good"
      : "Attention Needed";
  const healthScore = Math.max(0, 100 - deviations * 12 - (emergency ? 25 : 0));
  const urgency = emergency
    ? "seek-care"
    : deviations === 0
      ? "routine"
      : "monitor";
  const summary = emergency
    ? "One or more readings are far outside the app's typical range. Consider prompt professional medical evaluation."
    : deviations === 0
      ? "All five readings sit inside the app's typical reference ranges."
      : `${deviations} of your readings fall outside the app's typical reference range and may be worth monitoring.`;

  return {
    healthScore,
    status,
    emergency,
    urgency,
    whatLooksGood,
    areasToWatch,
    recommendations,
    summary,
  };
}
