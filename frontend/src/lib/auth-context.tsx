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
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { getFirebaseAuth } from "./firebase-client";

export type AppUser = { uid: string; name: string; email: string; avatar?: string };
type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

function appUser(user: User): AppUser {
  return {
    uid: user.uid,
    name: user.displayName ?? "CareAI user",
    email: user.email ?? "",
    ...(user.photoURL ? { avatar: user.photoURL } : {}),
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

  const signOut = useCallback(async () => {
    const firebaseAuth = getFirebaseAuth();
    await firebaseSignOut(firebaseAuth);
    queryClient.clear();
    window.localStorage.removeItem("aicare.user.v1");
    window.localStorage.removeItem("aicare.profiles.v1");
    window.localStorage.removeItem("aicare.vitals.v1");
  }, [queryClient]);

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signOut }),
    [user, loading, signInWithGoogle, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
