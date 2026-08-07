import { useCallback, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreateProfileExperience } from "@/components/profile/CreateProfileExperience";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";

export const Route = createFileRoute("/create-profile")({
  head: () => ({
    meta: [
      { title: "Create your profile — CareAI" },
      {
        name: "description",
        content: "Create your CareAI health profile for a more personalized experience.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CreateProfilePage,
});

export function CreateProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || (user && profileLoading)) return;
    if (!user) void navigate({ to: "/login", replace: true });
    else if (profile) void navigate({ to: "/dashboard", replace: true });
  }, [authLoading, user, profileLoading, profile, navigate]);

  const handleComplete = useCallback(() => {
    void navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  if (authLoading || (user && profileLoading) || !user || profile) {
    return <LoadingSpinner fullscreen label="Preparing your profile…" />;
  }

  return <CreateProfileExperience onComplete={handleComplete} />;
}
