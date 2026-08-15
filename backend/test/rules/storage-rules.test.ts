import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import {
  assertFails,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { ref, uploadBytes } from "firebase/storage";

let environment: RulesTestEnvironment;

before(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-careai-storage",
    storage: { rules: await readFile("../storage.rules", "utf8") },
  });
});

after(async () => environment.cleanup());

test("storage denies authenticated and unauthenticated writes", async () => {
  const path = "users/user-a/profile/avatar.png";
  await assertFails(
    uploadBytes(
      ref(environment.authenticatedContext("user-a").storage(), path),
      new Uint8Array([1]),
    ),
  );
  await assertFails(
    uploadBytes(
      ref(environment.unauthenticatedContext().storage(), path),
      new Uint8Array([1]),
    ),
  );
});
