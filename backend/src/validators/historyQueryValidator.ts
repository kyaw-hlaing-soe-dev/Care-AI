import { z } from "zod";
import { AppError } from "../utils/errors.js";

const historyQuerySchema = z
  .object({
    period: z.enum(["all", "7d", "30d"]).default("all"),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
    cursor: z
      .string()
      .min(1)
      .max(200)
      .regex(/^[A-Za-z0-9_-]+$/)
      .optional(),
  })
  .strict();

export type HistoryQuery = z.infer<typeof historyQuerySchema>;

export function validateHistoryQuery(value: unknown): HistoryQuery {
  const result = historyQuerySchema.safeParse(value);
  if (!result.success)
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "The history query is invalid.",
    );
  return result.data;
}
