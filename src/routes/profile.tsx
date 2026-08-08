import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  IncompleteProfile,
  PROFILE_VIEWS,
  ProfileDetails,
  ProfileLoadError,
  ProfileSkeleton,
  type ProfileView,
} from "@/components/profile/ProfileDetails";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/profile")({
  validateSearch: (search: Record<string, unknown>): { view: ProfileView } => ({
    view:
      typeof search.view === "string" && PROFILE_VIEWS.includes(search.view as ProfileView)
        ? (search.view as ProfileView)
        : "overview",
  }),
  head: () => ({
    meta: [
      { title: "My Profile — CareAI" },
      { name: "description", content: "Manage your CareAI profile and preferences." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error, refreshProfile } = useProfile();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { view } = Route.useSearch();

  useEffect(() => {
    if (!authLoading && !user) void navigate({ to: "/login", replace: true });
  }, [authLoading, user, navigate]);

  if (authLoading || !user) return <LoadingSpinner fullscreen label={t("profile.loading")} />;

  return (
    <AppShell hideMobileNavigation={view !== "overview"}>
      {profileLoading ? (
        <ProfileSkeleton />
      ) : error ? (
        <ProfileLoadError onRetry={refreshProfile} />
      ) : profile ? (
        <ProfileDetails
          user={user}
          profile={profile}
          view={view}
          onViewChange={(nextView) => {
            void navigate({ to: "/profile", search: { view: nextView } });
            window.requestAnimationFrame(() =>
              document.getElementById("profile-section-content")?.focus(),
            );
          }}
        />
      ) : (
        <IncompleteProfile />
      )}
    </AppShell>
  );
}
