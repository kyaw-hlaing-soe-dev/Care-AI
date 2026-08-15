import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getFunctions } from "firebase-admin/functions";

export const firebaseApp = getApps()[0] ?? initializeApp();
export const adminAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const adminFunctions = getFunctions(firebaseApp);
