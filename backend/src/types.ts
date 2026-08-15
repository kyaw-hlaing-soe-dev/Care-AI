export type ErrorCode =
  | "AUTH_ERROR"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "AI_ERROR"
  | "NETWORK_ERROR"
  | "PERMISSION_ERROR";

export type VitalStatus = "Good" | "Attention Needed" | "Urgent";
export type AiUrgency = "routine" | "monitor" | "seek-care";
export type AnalysisStatus = "pending" | "completed" | "failed";

export type VitalInput = {
  systolic: number;
  diastolic: number;
  heartRate: number;
  oxygenSaturation: number;
  temperatureC: number;
};

export type DeterministicAnalysis = {
  healthScore: number;
  status: VitalStatus;
  emergency: boolean;
  urgency: AiUrgency;
  whatLooksGood: string[];
  areasToWatch: string[];
  recommendations: string[];
  summary: string;
};

export type AiOutput = {
  summary: string;
  whatLooksGood: string[];
  areasToWatch: string[];
  recommendations: string[];
  urgency: AiUrgency;
  disclaimer: string;
};

export type ProfileInput = {
  displayName: string;
  dateOfBirth: string;
  sex: "male" | "female" | "prefer-not-to-say";
  heightCm: number;
  weightKg: number;
  bloodType?:
    "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "unknown";
  preferredLanguage?: "en" | "my" | "zh-CN";
};
