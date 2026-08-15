import { db } from "./firestoreClient.js";

export const userRef = (uid: string) => db.collection("users").doc(uid);
export const vitalsRef = (uid: string) => userRef(uid).collection("vitals");
export const vitalRef = (uid: string, readingId: string) =>
  vitalsRef(uid).doc(readingId);
export const analysesRef = (uid: string) => userRef(uid).collection("analyses");
export const analysisRef = (uid: string, readingId: string) =>
  analysesRef(uid).doc(readingId);
