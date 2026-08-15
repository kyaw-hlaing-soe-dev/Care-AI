import type { VitalInput, VitalRecord } from "./vitals";
import { submitVitals } from "./api-client";

export async function createVitalWithAi(
  input: VitalInput,
  idempotencyKey: string = crypto.randomUUID(),
): Promise<VitalRecord> {
  return submitVitals(input, idempotencyKey);
}
