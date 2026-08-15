import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getFunctions } from "firebase-admin/functions";
import { readFirebaseAdminServiceAccount } from "./firebaseAdminCredentials.js";

const serviceAccount = readFirebaseAdminServiceAccount(process.env);

export const firebaseApp =
  getApps()[0] ??
  (serviceAccount
    ? initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.projectId,
      })
    : initializeApp());
export const adminAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const adminFunctions = getFunctions(firebaseApp);
