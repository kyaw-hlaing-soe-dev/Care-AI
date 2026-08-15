import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

let environment: RulesTestEnvironment;
before(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-careai",
    firestore: { rules: await readFile("../firestore.rules", "utf8") },
  });
  await environment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "users/user-a"), {
      displayName: "User A",
    });
    await setDoc(
      doc(context.firestore(), "users/user-a/vitals/legacy-reading"),
      {
        healthScore: 100,
      },
    );
  });
});
after(async () => environment.cleanup());

const validProfile = {
  displayName: "Care User",
  dateOfBirth: "2000-01-02",
  sex: "prefer-not-to-say",
  heightCm: 165,
  weightKg: 60,
  profileCompleted: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};

const validVital = {
  systolic: 120,
  diastolic: 80,
  heartRate: 72,
  oxygenSaturation: 98,
  temperatureC: 36.7,
  healthScore: 100,
  status: "Good",
  emergency: false,
  urgency: "routine",
  algorithmVersion: "v1",
  analysisStatus: "unavailable",
  idempotencyKey: "reading-1234",
  createdAt: serverTimestamp(),
};

test("owner reads succeed while unauthenticated and cross-user reads fail", async () => {
  await assertSucceeds(
    getDoc(
      doc(
        environment.authenticatedContext("user-a").firestore(),
        "users/user-a",
      ),
    ),
  );
  await assertFails(
    getDoc(
      doc(
        environment.authenticatedContext("user-b").firestore(),
        "users/user-a",
      ),
    ),
  );
  await assertFails(
    getDoc(
      doc(environment.unauthenticatedContext().firestore(), "users/user-a"),
    ),
  );
});

test("an owner can create and update only a validated profile", async () => {
  const owner = environment.authenticatedContext("profile-owner").firestore();
  const reference = doc(owner, "users/profile-owner");
  await assertSucceeds(setDoc(reference, validProfile));
  await assertSucceeds(
    updateDoc(reference, {
      preferredLanguage: "my",
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(
    updateDoc(reference, { heightCm: 999, updatedAt: serverTimestamp() }),
  );
  await assertFails(deleteDoc(reference));
});

test("profile writes cannot target another user or add unexpected fields", async () => {
  const attacker = environment.authenticatedContext("attacker").firestore();
  await assertFails(setDoc(doc(attacker, "users/victim"), validProfile));
  await assertFails(
    setDoc(doc(attacker, "users/attacker"), { ...validProfile, role: "admin" }),
  );
});

test("an owner can create an immutable reading with the exact deterministic result", async () => {
  const owner = environment.authenticatedContext("vital-owner").firestore();
  const reference = doc(owner, "users/vital-owner/vitals/reading-1234");
  await assertSucceeds(setDoc(reference, validVital));
  await assertFails(updateDoc(reference, { healthScore: 0 }));
  await assertFails(deleteDoc(reference));
});

test("forged scores, invalid inputs, mismatched IDs, and cross-user writes fail", async () => {
  const owner = environment.authenticatedContext("owner-b").firestore();
  await assertFails(
    setDoc(doc(owner, "users/owner-b/vitals/reading-1234"), {
      ...validVital,
      healthScore: 99,
    }),
  );
  await assertFails(
    setDoc(doc(owner, "users/owner-b/vitals/reading-1234"), {
      ...validVital,
      oxygenSaturation: 101,
    }),
  );
  await assertFails(
    setDoc(doc(owner, "users/owner-b/vitals/different-id"), validVital),
  );
  await assertFails(
    setDoc(doc(owner, "users/someone-else/vitals/reading-1234"), validVital),
  );
  assert.ok(true);
});

test("emergency readings require the exact urgent result", async () => {
  const owner = environment.authenticatedContext("urgent-owner").firestore();
  const emergencyVital = {
    ...validVital,
    systolic: 180,
    healthScore: 63,
    status: "Urgent",
    emergency: true,
    urgency: "seek-care",
    idempotencyKey: "urgent-1234",
  };
  await assertSucceeds(
    setDoc(doc(owner, "users/urgent-owner/vitals/urgent-1234"), emergencyVital),
  );
});
