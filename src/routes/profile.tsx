import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  IncompleteProfile,
  ProfileDetails,
  ProfileLoadError,
  ProfileSkeleton,
} from "@/components/profile/ProfileDetails";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — CareAI" },
      { name: "description", content: "View your CareAI personal profile information." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error, refreshProfile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) void navigate({ to: "/login", replace: true });
  }, [authLoading, user, navigate]);

  if (authLoading || !user) return <LoadingSpinner fullscreen label="Checking your session…" />;

  return (
    <AppShell>
      {profileLoading ? (
        <ProfileSkeleton />
      ) : error ? (
        <ProfileLoadError onRetry={refreshProfile} />
      ) : profile ? (
        <ProfileDetails user={user} profile={profile} />
      ) : (
        <IncompleteProfile />
      )}
    </AppShell>
  );
}
