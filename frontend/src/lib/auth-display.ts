import type { AppUser, AuthProviderId } from "@/lib/auth-context";

export function primaryAccountValue(user: AppUser) {
  return user.email ?? "";
}

export function privateAccountValue(user: AppUser) {
  return user.email ?? "";
}

export function providerLabelKey(_provider: AuthProviderId) {
  return "profile.googleAccount";
}

export function providerSummaryKey(user: AppUser) {
  const hasGoogle = user.providers.includes("google");
  return hasGoogle ? "profile.googleAccount" : "profile.connectedAccount";
}

export function displayNameFallback(user: AppUser, profileName?: string) {
  const name = profileName?.trim() || user.name.trim();
  if (name && name !== "CareAI user") return name;
  return "CareAI user";
}
