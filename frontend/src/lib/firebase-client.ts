import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const config = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"],
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"],
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"],
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"],
  appId: import.meta.env["VITE_FIREBASE_APP_ID"],
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(config);
export const firebaseAuth = getAuth(firebaseApp);

const emulatorMarker = "__careAiAuthEmulatorConnected";
const emulatorState = globalThis as typeof globalThis & {
  __careAiAuthEmulatorConnected?: boolean;
};
if (
  typeof window !== "undefined" &&
  import.meta.env["VITE_USE_FIREBASE_EMULATORS"] === "true" &&
  !emulatorState[emulatorMarker]
) {
  connectAuthEmulator(firebaseAuth, "http://127.0.0.1:9099", {
    disableWarnings: true,
  });
  emulatorState[emulatorMarker] = true;
}
