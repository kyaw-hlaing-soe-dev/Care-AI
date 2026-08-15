import assert from "node:assert/strict";
import test from "node:test";
import { readFirebaseAdminServiceAccount } from "../src/config/firebaseAdminCredentials.js";

const PROJECT_ID = "careai-test";
const CLIENT_EMAIL = "careai-test@example.iam.gserviceaccount.com";
const ESCAPED_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\\nnot-a-real-key\\n-----END PRIVATE KEY-----";

test("uses Application Default Credentials when explicit values are absent", () => {
  assert.equal(readFirebaseAdminServiceAccount({}), undefined);
});

test("fails closed when explicit service account values are incomplete", () => {
  assert.throws(
    () =>
      readFirebaseAdminServiceAccount({
        FIREBASE_PROJECT_ID: PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: CLIENT_EMAIL,
      }),
    /configuration is incomplete/,
  );
});

test("normalizes an escaped multiline private key for non-Google runtimes", () => {
  assert.deepEqual(
    readFirebaseAdminServiceAccount({
      FIREBASE_PROJECT_ID: ` ${PROJECT_ID} `,
      FIREBASE_CLIENT_EMAIL: ` ${CLIENT_EMAIL} `,
      FIREBASE_PRIVATE_KEY: ESCAPED_PRIVATE_KEY,
    }),
    {
      projectId: PROJECT_ID,
      clientEmail: CLIENT_EMAIL,
      privateKey: "-----BEGIN PRIVATE KEY-----\nnot-a-real-key\n-----END PRIVATE KEY-----",
    },
  );
});

test("rejects a malformed private key without exposing its value", () => {
  assert.throws(
    () =>
      readFirebaseAdminServiceAccount({
        FIREBASE_PROJECT_ID: PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: "not-a-private-key",
      }),
    /configuration is invalid/,
  );
});
