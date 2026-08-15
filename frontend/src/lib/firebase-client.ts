import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";

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
};

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;
let firestoreDatabase: Firestore | undefined;

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

export function getFirestoreDatabase() {
  if (typeof window === "undefined") {
    throw new Error("Cloud Firestore is only available in the browser.");
  }
  firestoreDatabase ??= getFirestore(getFirebaseApp());
  connectToFirestoreEmulator(firestoreDatabase);
  return firestoreDatabase;
}

const emulatorMarker = "__careAiAuthEmulatorConnected";
const emulatorState = globalThis as typeof globalThis & {
  __careAiAuthEmulatorConnected?: boolean;
  __careAiFirestoreEmulatorConnected?: boolean;
};

function connectToAuthEmulator(auth: Auth) {
  if (import.meta.env["VITE_USE_FIREBASE_EMULATORS"] === "true" && !emulatorState[emulatorMarker]) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    emulatorState[emulatorMarker] = true;
  }
}

function connectToFirestoreEmulator(database: Firestore) {
  if (
    import.meta.env["VITE_USE_FIREBASE_EMULATORS"] === "true" &&
    !emulatorState.__careAiFirestoreEmulatorConnected
  ) {
    connectFirestoreEmulator(database, "127.0.0.1", 8080);
    emulatorState.__careAiFirestoreEmulatorConnected = true;
  }
}
