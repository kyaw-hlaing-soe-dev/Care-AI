import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoginExperience } from "@/components/auth/LoginExperience";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — CareAI" },
      {
        name: "description",
        content: "Sign in to CareAI to save vitals and review your health history.",
      },
      { property: "og:title", content: "Sign in — CareAI" },
      {
        property: "og:description",
        content: "Sign in to CareAI to save vitals and review your health history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

export function LoginPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!user || profileLoading) return;
    void navigate({ to: profile ? "/dashboard" : "/create-profile", replace: true });
  }, [user, profileLoading, profile, navigate]);

  async function handleSignIn() {
    setPending(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError(t("errors.signIn"));
    } finally {
      setPending(false);
    }
  }

  if (authLoading || (user && profileLoading)) {
    return <LoadingSpinner fullscreen label={t("auth.checkingAccount")} />;
  }

  return <LoginExperience onSignIn={() => void handleSignIn()} pending={pending} error={error} />;
}
