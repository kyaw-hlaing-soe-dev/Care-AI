export type VitalStatus = "Good" | "Attention Needed" | "Urgent" | "Pending";

export type VitalInput = {
  temperature: number;
  systolic: number;
  diastolic: number;
  heartRate: number;
  oxygen: number;
};

export type VitalAnalysis = {
  status: VitalStatus;
  emergency: boolean;
  score: number;
  summary: string;
  good: string[];
  concerns: string[];
  recommendations: string[];
};

export type VitalRecord = VitalInput & {
  id: string;
  recordedAt: string; // ISO
  analysis: VitalAnalysis;
};

export const RANGES = {
  temperature: { min: 36.1, max: 37.2, hint: "Normal: 36.1°C – 37.2°C", unit: "°C" },
  systolic: { min: 90, max: 120, hint: "Normal: 90 – 120 mmHg", unit: "mmHg" },
  diastolic: { min: 60, max: 80, hint: "Normal: 60 – 80 mmHg", unit: "mmHg" },
  heartRate: { min: 60, max: 100, hint: "Normal: 60 – 100 bpm", unit: "bpm" },
  oxygen: { min: 95, max: 100, hint: "Normal: 95% – 100%", unit: "%" },
} as const;

export type VitalKey = keyof typeof RANGES;

export function isInRange(key: VitalKey, value: number) {
  const r = RANGES[key];
  return value >= r.min && value <= r.max;
}

const LABELS: Record<VitalKey, string> = {
  temperature: "Temperature",
  systolic: "Systolic pressure",
  diastolic: "Diastolic pressure",
  heartRate: "Heart rate",
  oxygen: "Oxygen saturation",
};

/**
 * Rule-based analysis stand-in for the AI service. Same output shape the
 * API returns, so swapping in a real request later is a drop-in change.
 */
export function analyzeVitals(v: VitalInput): VitalAnalysis {
  const good: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];
  let emergency = false;
  let deviations = 0;

  (Object.keys(RANGES) as VitalKey[]).forEach((key) => {
    const value = v[key];
    const { min, max, unit } = RANGES[key];
    if (value >= min && value <= max) {
      good.push(`${LABELS[key]} is within the normal range at ${value}${unit}.`);
    } else {
      deviations += 1;
      const direction = value < min ? "below" : "above";
      concerns.push(`${LABELS[key]} is ${direction} the normal range at ${value}${unit}.`);
    }
  });

  if (v.oxygen < 90 || v.temperature >= 39.5 || v.systolic >= 180 || v.diastolic >= 120 || v.heartRate >= 130 || v.heartRate <= 40) {
    emergency = true;
  }

  if (v.temperature > RANGES.temperature.max) {
    recommendations.push("Rest, hydrate frequently, and re-check your temperature in a few hours.");
  }
  if (v.systolic > RANGES.systolic.max || v.diastolic > RANGES.diastolic.max) {
    recommendations.push("Reduce salt intake, avoid caffeine today, and re-measure while seated and calm.");
  }
  if (v.heartRate > RANGES.heartRate.max) {
    recommendations.push("Sit down for five minutes of slow breathing, then take the reading again.");
  }
  if (v.oxygen < RANGES.oxygen.min) {
    recommendations.push("Sit upright, breathe deeply, and monitor your oxygen level closely.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Keep your current routine — steady sleep, movement, and hydration are working.");
  }
  recommendations.push("Log your vitals at the same time each day for a more accurate trend.");

  const status: VitalStatus = emergency ? "Urgent" : deviations === 0 ? "Good" : "Attention Needed";
  const score = Math.max(0, 100 - deviations * 12 - (emergency ? 25 : 0));

  const summary = emergency
    ? "One or more readings are far outside the safe range. This needs immediate medical attention rather than home monitoring."
    : deviations === 0
      ? "All five readings sit comfortably inside their normal ranges. Your vitals look stable and healthy today."
      : `${deviations} of your readings fall outside the typical range. Nothing looks alarming, but it's worth watching over the next few days.`;

  return { status, emergency, score, summary, good, concerns, recommendations };
}

export function formatRecordedAt(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today at ${time}`;
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · ${time}`;
}
