import type { ProfileInput } from "../types.js";
import { FieldValue } from "../data/firestoreClient.js";
import { userRef } from "../data/firestorePaths.js";

export async function getProfile(
  uid: string,
): Promise<Record<string, unknown> | null> {
  const snapshot = await userRef(uid).get();
  return snapshot.exists ? serialize(snapshot.data() ?? {}) : null;
}

export async function saveProfile(
  uid: string,
  input: ProfileInput,
): Promise<Record<string, unknown>> {
  const ref = userRef(uid);
  const current = await ref.get();
  const data = {
    ...input,
    profileCompleted: true,
    createdAt: current.exists
      ? current.get("createdAt")
      : FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (!input.bloodType) delete (data as { bloodType?: string }).bloodType;
  await ref.set(data, { merge: false });
  return (await getProfile(uid))!;
}

export async function savePreference(
  uid: string,
  preferredLanguage: ProfileInput["preferredLanguage"],
): Promise<Record<string, unknown> | null> {
  const ref = userRef(uid);
  await ref.update({
    preferredLanguage,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return getProfile(uid);
}

function serialize(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      item && typeof item === "object" && "toDate" in item
        ? (item as { toDate(): Date }).toDate().toISOString()
        : item,
    ]),
  );
}
