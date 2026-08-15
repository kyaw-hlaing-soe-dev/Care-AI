import { defineSecret, defineString } from "firebase-functions/params";

export const openRouterApiKey = defineSecret("OPENROUTER_API_KEY");
export const openRouterModel = defineString("OPENROUTER_MODEL");
export const openRouterSiteUrl = defineString("OPENROUTER_SITE_URL", {
  default: "",
});
export const openRouterAppName = defineString("OPENROUTER_APP_NAME", {
  default: "CareAI",
});
export const allowedOrigins = defineString("CAREAI_ALLOWED_ORIGINS", {
  default: "http://localhost:3000,http://localhost:5173",
});

export function getAllowedOrigins(): string[] {
  return allowedOrigins
    .value()
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}
