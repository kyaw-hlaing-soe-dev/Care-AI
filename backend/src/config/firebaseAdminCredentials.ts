import type { ServiceAccount } from "firebase-admin/app";

type Environment = Readonly<Record<string, string | undefined>>;

/**
 * Uses explicit credentials only outside Google-managed runtimes (for example,
 * Vercel). Cloud Functions leaves these values unset and continues to use
 * Application Default Credentials.
 */
export function readFirebaseAdminServiceAccount(
  environment: Environment,
): ServiceAccount | undefined {
  const projectId = environment["FIREBASE_PROJECT_ID"]?.trim();
  const clientEmail = environment["FIREBASE_CLIENT_EMAIL"]?.trim();
  const rawPrivateKey = environment["FIREBASE_PRIVATE_KEY"]?.trim();

  if (!projectId && !clientEmail && !rawPrivateKey) return undefined;
  if (!projectId || !clientEmail || !rawPrivateKey) {
    throw new Error("Firebase Admin service account configuration is incomplete.");
  }

  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
  if (
    !privateKey.startsWith("-----BEGIN PRIVATE KEY-----\n") ||
    !privateKey.endsWith("\n-----END PRIVATE KEY-----")
  ) {
    throw new Error("Firebase Admin service account configuration is invalid.");
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}
