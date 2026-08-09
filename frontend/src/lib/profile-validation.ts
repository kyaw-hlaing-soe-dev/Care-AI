import type { BloodType, ProfileInput, ProfileSex, UserProfile } from "@/lib/profile-context";

export type ProfileDraft = {
  displayName: string;
  dateOfBirth: string;
  sex: ProfileSex | "";
  heightCm: string;
  weightKg: string;
  bloodType: BloodType | "";
};

export type ProfileFieldErrors = Partial<Record<keyof ProfileDraft, string>>;

export const SEX_OPTIONS: Array<{ value: ProfileSex; labelKey: string }> = [
  { value: "male", labelKey: "createProfile.male" },
  { value: "female", labelKey: "createProfile.female" },
  { value: "prefer-not-to-say", labelKey: "createProfile.preferNotToSay" },
];

export const BLOOD_TYPES: Array<{ value: BloodType; label: string }> = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A−" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B−" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB−" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O−" },
  { value: "unknown", label: "Unknown" },
];

export function validateProfile(draft: ProfileDraft, translate: (key: string) => string = (key) => key): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};
  const displayName = draft.displayName.trim();
  const height = Number(draft.heightCm);
  const weight = Number(draft.weightKg);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (!displayName) errors.displayName = translate("validation.displayNameRequired");
  else if (displayName.length < 2 || displayName.length > 50) {
    errors.displayName = translate("validation.displayNameLength");
  }

  if (!draft.dateOfBirth) errors.dateOfBirth = translate("validation.dateRequired");
  else if (Number.isNaN(Date.parse(`${draft.dateOfBirth}T00:00:00`))) {
    errors.dateOfBirth = translate("validation.dateInvalid");
  } else if (new Date(`${draft.dateOfBirth}T00:00:00`) > today) {
    errors.dateOfBirth = translate("validation.dateFuture");
  }

  if (!draft.sex) errors.sex = translate("validation.sexRequired");

  if (!draft.heightCm || !Number.isFinite(height) || height < 50 || height > 250) {
    errors.heightCm = translate("validation.heightInvalid");
  }

  if (!draft.weightKg || !Number.isFinite(weight) || weight < 2 || weight > 500) {
    errors.weightKg = translate("validation.weightInvalid");
  }

  return errors;
}

export function profileToDraft(profile: UserProfile): ProfileDraft {
  return {
    displayName: profile.displayName ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    sex: profile.sex ?? "",
    heightCm: Number.isFinite(profile.heightCm) ? String(profile.heightCm) : "",
    weightKg: Number.isFinite(profile.weightKg) ? String(profile.weightKg) : "",
    bloodType: profile.bloodType ?? "",
  };
}

export function draftToProfileInput(draft: ProfileDraft): ProfileInput {
  return {
    displayName: draft.displayName.trim(),
    dateOfBirth: draft.dateOfBirth,
    sex: draft.sex as ProfileSex,
    heightCm: Number(draft.heightCm),
    weightKg: Number(draft.weightKg),
    ...(draft.bloodType ? { bloodType: draft.bloodType } : {}),
  };
}
