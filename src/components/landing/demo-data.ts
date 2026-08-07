import type { VitalAnalysis, VitalRecord } from "@/lib/vitals";

export const LANDING_DEMO_ANALYSIS: VitalAnalysis = {
  status: "Attention Needed",
  emergency: false,
  score: 88,
  summary:
    "1 of your readings falls outside the typical range. Nothing looks alarming, but it's worth watching over the next few days.",
  good: [
    "Heart rate is within the typical range at 72 bpm.",
    "Oxygen saturation is within the typical range at 98%.",
  ],
  concerns: ["Temperature is above the typical range at 39.2°C."],
  recommendations: ["Rest, stay hydrated, and re-check your temperature later."],
};

export const LANDING_DEMO_RECORDS: VitalRecord[] = [
  {
    id: "landing-demo-latest",
    recordedAt: "2026-08-08T00:01:00+06:30",
    systolic: 120,
    diastolic: 76,
    heartRate: 72,
    oxygen: 98,
    temperature: 39.2,
    analysis: LANDING_DEMO_ANALYSIS,
  },
  {
    id: "landing-demo-previous",
    recordedAt: "2026-08-07T22:40:00+06:30",
    systolic: 120,
    diastolic: 90,
    heartRate: 76,
    oxygen: 98,
    temperature: 37.4,
    analysis: { ...LANDING_DEMO_ANALYSIS, score: 84 },
  },
  {
    id: "landing-demo-three",
    recordedAt: "2026-08-06T22:40:00+06:30",
    systolic: 118,
    diastolic: 78,
    heartRate: 70,
    oxygen: 97,
    temperature: 36.8,
    analysis: { ...LANDING_DEMO_ANALYSIS, status: "Good", score: 92 },
  },
  {
    id: "landing-demo-four",
    recordedAt: "2026-08-05T22:40:00+06:30",
    systolic: 122,
    diastolic: 80,
    heartRate: 74,
    oxygen: 99,
    temperature: 36.7,
    analysis: { ...LANDING_DEMO_ANALYSIS, status: "Good", score: 94 },
  },
  {
    id: "landing-demo-five",
    recordedAt: "2026-08-04T22:40:00+06:30",
    systolic: 119,
    diastolic: 77,
    heartRate: 71,
    oxygen: 98,
    temperature: 36.6,
    analysis: { ...LANDING_DEMO_ANALYSIS, status: "Good", score: 93 },
  },
];

export const LANDING_TRACKER_DEMO = {
  systolic: 120,
  diastolic: 76,
  heartRate: 72,
  oxygen: 98,
  temperature: 36.7,
} as const;
