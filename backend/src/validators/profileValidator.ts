import { z } from "zod";
import type { ProfileInput } from "../types.js";
import { AppError } from "../utils/errors.js";

const dateOfBirth = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(parsed.valueOf()) &&
      parsed.toISOString().startsWith(value) &&
      parsed <= new Date()
    );
  });

const profileSchema = z
  .object({
    displayName: z.string().trim().min(2).max(50),
    dateOfBirth,
    sex: z.enum(["male", "female", "prefer-not-to-say"]),
    heightCm: z.number().finite().min(50).max(250),
    weightKg: z.number().finite().min(2).max(500),
    bloodType: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"])
      .optional(),
    preferredLanguage: z.enum(["en", "my", "zh-CN"]).optional(),
  })
  .strict();

const preferenceSchema = z
  .object({
    preferredLanguage: z.enum(["en", "my", "zh-CN"]),
  })
  .strict();

export function validateProfile(value: unknown): ProfileInput {
  const result = profileSchema.safeParse(value);
  if (!result.success)
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "Check the profile fields and try again.",
    );
  return result.data;
}

export function validatePreference(
  value: unknown,
): ProfileInput["preferredLanguage"] {
  const result = preferenceSchema.safeParse(value);
  if (!result.success) throw new AppError("VALIDATION_ERROR", 400);
  return result.data.preferredLanguage;
}
