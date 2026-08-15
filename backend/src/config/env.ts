import { defineSecret, defineString } from "firebase-functions/params";

export const openRouterApiKey = defineSecret("OPENROUTER_API_KEY");
export const openRouterModel = defineString("OPENROUTER_MODEL");
export const openRouterSiteUrl = defineString("OPENROUTER_SITE_URL", {
  default: "",
});
export const openRouterAppName = defineString("OPENROUTER_APP_NAME", {
  default: "CareAI",
});
export const DEFAULT_ALLOWED_ORIGINS = [
  "https://care-ai-six.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
] as const;
export const allowedOrigins = defineString("CAREAI_ALLOWED_ORIGINS", {
  default: DEFAULT_ALLOWED_ORIGINS.join(","),
});

export function getAllowedOrigins(): string[] {
  return parseAllowedOrigins(allowedOrigins.value());
}

export function parseAllowedOrigins(value: string): string[] {
  return value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function isAllowedOrigin(origin: string, origins = getAllowedOrigins()): boolean {
  return origins.includes(origin);
}
