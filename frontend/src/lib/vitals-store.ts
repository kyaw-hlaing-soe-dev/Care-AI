import type { VitalInput, VitalRecord } from "./vitals";
import { submitVitals } from "./firestore-service";

export async function createVital(
  input: VitalInput,
  idempotencyKey: string = crypto.randomUUID(),
): Promise<VitalRecord> {
  return submitVitals(input, idempotencyKey);
}
