import type { AppUser, AuthProviderId } from "@/lib/auth-context";

export function maskPhoneNumber(phoneNumber: string | undefined) {
  if (!phoneNumber) return "";
  const digits = phoneNumber.replace(/\D/g, "");
  const last = digits.slice(-4);
  const prefix = phoneNumber.match(/^\+\d{1,3}/)?.[0] ?? "+";
  return last ? `${prefix} ... ${last}` : prefix;
}

export function primaryAccountValue(user: AppUser) {
  return user.email ?? user.phoneNumber ?? "";
}

export function privateAccountValue(user: AppUser) {
  return user.email ?? maskPhoneNumber(user.phoneNumber);
}

export function providerLabelKey(provider: AuthProviderId) {
  return provider === "google" ? "profile.googleAccount" : "profile.phoneVerified";
}

export function providerSummaryKey(user: AppUser) {
  const hasGoogle = user.providers.includes("google");
  const hasPhone = user.providers.includes("phone");
  if (hasGoogle && hasPhone) return "profile.googleAndPhone";
  if (hasPhone) return "profile.phoneVerified";
  return "profile.googleAccount";
}

export function displayNameFallback(user: AppUser, profileName?: string) {
  const name = profileName?.trim() || user.name.trim();
  if (name && name !== "CareAI user") return name;
  return maskPhoneNumber(user.phoneNumber) || "CareAI user";
}
