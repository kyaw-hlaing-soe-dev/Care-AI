import { z } from "zod";
import type { VitalInput } from "../types.js";
import { AppError } from "../utils/errors.js";

const vitalSchema = z
  .object({
    systolic: z.number().finite().min(50).max(300),
    diastolic: z.number().finite().min(30).max(200),
    heartRate: z.number().finite().min(20).max(250),
    oxygenSaturation: z.number().finite().min(50).max(100),
    temperatureC: z.number().finite().min(30).max(45),
  })
  .strict();

export function validateVitalInput(value: unknown): VitalInput {
  const result = vitalSchema.safeParse(value);
  if (!result.success)
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "Check the highlighted values.",
    );
  return result.data;
}
