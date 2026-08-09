import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AppShell } from "@/components/app/AppShell";
import { useTranslation } from "react-i18next";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || (user && profileLoading)) return;
    if (!user) void navigate({ to: "/login", replace: true });
    else if (!profile) void navigate({ to: "/create-profile", replace: true });
  }, [loading, user, profileLoading, profile, navigate]);

  if (loading || (user && profileLoading) || !user || !profile) {
    return <LoadingSpinner fullscreen label={t("profile.loading")} />;
  }

  return <AppShell>{children}</AppShell>;
}
