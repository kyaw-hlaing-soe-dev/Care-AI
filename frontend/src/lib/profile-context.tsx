import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import type { LanguageCode } from "@/i18n/languages";
import { loadProfile, savePreferredLanguage, saveProfile } from "./firestore-service";

export type ProfileSex = "male" | "female" | "prefer-not-to-say";
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "unknown";
export type PreferredLanguage = LanguageCode;
export type ProfileInput = {
  displayName: string;
  dateOfBirth: string;
  sex: ProfileSex;
  heightCm: number;
  weightKg: number;
  bloodType?: BloodType;
};
export type UserProfile = ProfileInput & {
  profileCompleted: true;
  preferredLanguage?: PreferredLanguage;
  createdAt: string;
  updatedAt: string;
};
type ProfileContextValue = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  createProfile: (input: ProfileInput) => Promise<UserProfile>;
  updateProfile: (input: ProfileInput) => Promise<UserProfile>;
  updatePreferredLanguage: (language: PreferredLanguage) => Promise<UserProfile>;
  refreshProfile: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    if (authLoading) {
      setLoading(true);
      return () => {
        active = false;
      };
    }
    if (!user) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return () => {
        active = false;
      };
    }
    setLoading(true);
    setError(null);
    void loadProfile()
      .then((next) => {
        if (active) {
          setProfile(next?.profileCompleted === true ? next : null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setProfile(null);
          setError("We couldn't load your profile.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [authLoading, user, refreshVersion]);

  const persist = useCallback(
    async (input: ProfileInput) => {
      if (!user) throw new Error("You need to be signed in to save a profile.");
      const next = await saveProfile({
        ...input,
        ...(profile?.preferredLanguage ? { preferredLanguage: profile.preferredLanguage } : {}),
      });
      setProfile(next);
      return next;
    },
    [profile?.preferredLanguage, user],
  );

  const updatePreferredLanguage = useCallback(
    async (language: PreferredLanguage) => {
      if (!user) throw new Error("You need to be signed in to update preferences.");
      const next = await savePreferredLanguage(language);
      setProfile(next);
      return next;
    },
    [user],
  );

  const refreshProfile = useCallback(() => setRefreshVersion((value) => value + 1), []);
  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      createProfile: persist,
      updateProfile: persist,
      updatePreferredLanguage,
      refreshProfile,
    }),
    [profile, loading, error, persist, updatePreferredLanguage, refreshProfile],
  );
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error("useProfile must be used within ProfileProvider");
  return value;
}
