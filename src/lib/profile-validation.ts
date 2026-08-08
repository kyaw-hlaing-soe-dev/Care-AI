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

export const SEX_OPTIONS: Array<{ value: ProfileSex; label: string }> = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
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

export function validateProfile(draft: ProfileDraft): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};
  const displayName = draft.displayName.trim();
  const height = Number(draft.heightCm);
  const weight = Number(draft.weightKg);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (!displayName) errors.displayName = "Please enter your display name.";
  else if (displayName.length < 2 || displayName.length > 50) {
    errors.displayName = "Display name should be between 2 and 50 characters.";
  }

  if (!draft.dateOfBirth) errors.dateOfBirth = "Please enter your date of birth.";
  else if (Number.isNaN(Date.parse(`${draft.dateOfBirth}T00:00:00`))) {
    errors.dateOfBirth = "Please enter a valid date of birth.";
  } else if (new Date(`${draft.dateOfBirth}T00:00:00`) > today) {
    errors.dateOfBirth = "Date of birth cannot be in the future.";
  }

  if (!draft.sex) errors.sex = "Please select an option.";

  if (!draft.heightCm || !Number.isFinite(height) || height < 50 || height > 250) {
    errors.heightCm = "Please enter a valid height between 50 and 250 cm.";
  }

  if (!draft.weightKg || !Number.isFinite(weight) || weight < 2 || weight > 500) {
    errors.weightKg = "Please enter a valid weight between 2 and 500 kg.";
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
