import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type ConfirmationResult,
  GoogleAuthProvider,
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { getFirebaseAuth } from "./firebase-client";
import type { LanguageCode } from "@/i18n/languages";

export type AuthProviderId = "google" | "phone";
export type AppUser = {
  uid: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  providers: AuthProviderId[];
};
type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  createPhoneRecaptchaVerifier: (
    containerOrId: HTMLElement | string,
    language: LanguageCode,
  ) => RecaptchaVerifier;
  sendPhoneVerification: (
    phoneNumber: string,
    verifier: RecaptchaVerifier,
  ) => Promise<ConfirmationResult>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

function authProviders(user: User): AuthProviderId[] {
  const providers = new Set<AuthProviderId>();
  for (const provider of user.providerData) {
    if (provider.providerId === GoogleAuthProvider.PROVIDER_ID) providers.add("google");
    if (provider.providerId === "phone") providers.add("phone");
  }
  if (user.phoneNumber) providers.add("phone");
  return Array.from(providers);
}

function appUser(user: User): AppUser {
  const displayName = user.displayName?.trim();
  const phoneNumber = user.phoneNumber ?? undefined;
  return {
    uid: user.uid,
    name: displayName || "CareAI user",
    ...(user.email ? { email: user.email } : {}),
    ...(phoneNumber ? { phoneNumber } : {}),
    ...(user.photoURL ? { avatar: user.photoURL } : {}),
    providers: authProviders(user),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();
    const marker = "careai.firebase-cutover.v1";
    if (!window.localStorage.getItem(marker)) {
      window.localStorage.removeItem("aicare.user.v1");
      window.localStorage.removeItem("aicare.profiles.v1");
      window.localStorage.removeItem("aicare.vitals.v1");
      window.localStorage.setItem(marker, "complete");
    }
    return onAuthStateChanged(firebaseAuth, (next) => {
      setUser(next ? appUser(next) : null);
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const firebaseAuth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider);
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === "auth/popup-blocked") await signInWithRedirect(firebaseAuth, provider);
      else throw error;
    }
  }, []);

  const createPhoneRecaptchaVerifier = useCallback(
    (containerOrId: HTMLElement | string, language: LanguageCode) => {
      const firebaseAuth = getFirebaseAuth();
      firebaseAuth.languageCode = language;
      return new RecaptchaVerifier(firebaseAuth, containerOrId, {
        size: "invisible",
      });
    },
    [],
  );

  const sendPhoneVerification = useCallback((phoneNumber: string, verifier: RecaptchaVerifier) => {
    const firebaseAuth = getFirebaseAuth();
    return signInWithPhoneNumber(firebaseAuth, phoneNumber, verifier);
  }, []);

  const signOut = useCallback(async () => {
    const firebaseAuth = getFirebaseAuth();
    await firebaseSignOut(firebaseAuth);
    queryClient.clear();
    window.localStorage.removeItem("aicare.user.v1");
    window.localStorage.removeItem("aicare.profiles.v1");
    window.localStorage.removeItem("aicare.vitals.v1");
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle,
      createPhoneRecaptchaVerifier,
      sendPhoneVerification,
      signOut,
    }),
    [user, loading, signInWithGoogle, createPhoneRecaptchaVerifier, sendPhoneVerification, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
