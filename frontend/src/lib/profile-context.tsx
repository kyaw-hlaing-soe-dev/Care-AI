import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth, type AppUser } from "@/lib/auth-context";
import { LANGUAGE_STORAGE_KEY, normalizeLanguage, type LanguageCode } from "@/i18n/languages";

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

type StoredProfiles = Record<string, UserProfile>;

const STORAGE_KEY = "aicare.profiles.v1";
const ProfileContext = createContext<ProfileContextValue | null>(null);

function accountKey(user: AppUser) {
  return user.email.trim().toLocaleLowerCase();
}

function readProfiles(): StoredProfiles {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredProfiles) : {};
  } catch (error) {
    throw new Error("Unable to read the saved profile.", { cause: error });
  }
}

async function getAuthenticatedProfile(user: AppUser): Promise<UserProfile | null> {
  await Promise.resolve();
  return readProfiles()[accountKey(user)] ?? null;
}

async function saveAuthenticatedProfile(user: AppUser, input: ProfileInput): Promise<UserProfile> {
  const profiles = readProfiles();
  const key = accountKey(user);
  const now = new Date().toISOString();
  const profile: UserProfile = {
    ...profiles[key],
    ...input,
    preferredLanguage:
      profiles[key]?.preferredLanguage ??
      normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)),
    createdAt: profiles[key]?.createdAt ?? now,
    updatedAt: now,
  };
  if (!input.bloodType) delete profile.bloodType;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profiles, [key]: profile }));
  return profile;
}

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
      setError(null);
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
    void getAuthenticatedProfile(user)
      .then((nextProfile) => {
        if (!active) return;
        setProfile(nextProfile);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setProfile(null);
        setError("We couldn't load your profile.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user, refreshVersion]);

  const refreshProfile = useCallback(() => {
    setRefreshVersion((version) => version + 1);
  }, []);

  const createProfile = useCallback(
    async (input: ProfileInput) => {
      if (!user) throw new Error("You need to be signed in to create a profile.");
      const nextProfile = await saveAuthenticatedProfile(user, input);
      setProfile(nextProfile);
      return nextProfile;
    },
    [user],
  );

  const updateProfile = createProfile;

  const updatePreferredLanguage = useCallback(
    async (language: PreferredLanguage) => {
      if (!user) throw new Error("You need to be signed in to update your preferences.");

      const profiles = readProfiles();
      const key = accountKey(user);
      const currentProfile = profiles[key];
      if (!currentProfile) throw new Error("Complete your profile before updating preferences.");

      const nextProfile: UserProfile = {
        ...currentProfile,
        preferredLanguage: language,
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profiles, [key]: nextProfile }));
      setProfile(nextProfile);
      return nextProfile;
    },
    [user],
  );

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      createProfile,
      updateProfile,
      updatePreferredLanguage,
      refreshProfile,
    }),
    [
      profile,
      loading,
      error,
      createProfile,
      updateProfile,
      updatePreferredLanguage,
      refreshProfile,
    ],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within ProfileProvider");
  return context;
}
