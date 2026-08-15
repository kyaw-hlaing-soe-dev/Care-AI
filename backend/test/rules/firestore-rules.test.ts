import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

let environment: RulesTestEnvironment;
before(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-careai",
    firestore: { rules: await readFile("../firestore.rules", "utf8") },
  });
  await environment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "users/user-a"), {
      displayName: "A",
    });
    await setDoc(doc(context.firestore(), "users/user-a/vitals/reading-1"), {
      healthScore: 100,
    });
  });
});
after(async () => environment.cleanup());

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

test("all client writes are denied, including owner writes", async () => {
  await assertFails(
    setDoc(
      doc(
        environment.authenticatedContext("user-a").firestore(),
        "users/user-a/vitals/forged",
      ),
      { healthScore: 100 },
    ),
  );
  assert.ok(true);
});
