import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";

function publicConfigValue(value: string | undefined, fallback: string) {
  const normalized = value?.trim();
  return normalized || fallback;
}

const config = {
  apiKey: publicConfigValue(
    import.meta.env["VITE_FIREBASE_API_KEY"],
    "AIzaSyCkPocmvnz3Jcou_xq1FJY1rZJ0dWUcKPA",
  ),
  authDomain: publicConfigValue(
    import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"],
    "care-ai-4eb8d.firebaseapp.com",
  ),
  projectId: publicConfigValue(import.meta.env["VITE_FIREBASE_PROJECT_ID"], "care-ai-4eb8d"),
  storageBucket: publicConfigValue(
    import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"],
    "care-ai-4eb8d.firebasestorage.app",
  ),
  messagingSenderId: publicConfigValue(
    import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"],
    "701117965257",
  ),
  appId: publicConfigValue(
    import.meta.env["VITE_FIREBASE_APP_ID"],
    "1:701117965257:web:3729e177034f3285ac3e18",
  ),
  measurementId: publicConfigValue(import.meta.env["VITE_FIREBASE_MEASUREMENT_ID"], "G-80P2G082NP"),
};

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;

function getFirebaseApp() {
  firebaseApp ??= getApps().length ? getApp() : initializeApp(config);
  return firebaseApp;
}

export function getFirebaseAuth() {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser.");
  }
  firebaseAuth ??= getAuth(getFirebaseApp());
  connectToAuthEmulator(firebaseAuth);
  return firebaseAuth;
}

if (typeof window !== "undefined") {
  void import("firebase/analytics")
    .then(async ({ getAnalytics, isSupported }) => {
      if (await isSupported()) getAnalytics(getFirebaseApp());
    })
    .catch(() => {
      // Analytics is optional and must never prevent authentication or app startup.
    });
}

const emulatorMarker = "__careAiAuthEmulatorConnected";
const emulatorState = globalThis as typeof globalThis & {
  __careAiAuthEmulatorConnected?: boolean;
};

function connectToAuthEmulator(auth: Auth) {
  if (import.meta.env["VITE_USE_FIREBASE_EMULATORS"] === "true" && !emulatorState[emulatorMarker]) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    emulatorState[emulatorMarker] = true;
  }
}
