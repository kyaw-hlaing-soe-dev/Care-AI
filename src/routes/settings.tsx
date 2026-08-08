import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/app/PageHeader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LanguageSettings } from "@/components/settings/LanguageSettings";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — CareAI" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  ),
});

function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-7">
      <PageHeader eyebrow={t("settings.eyebrow")} title={t("settings.title")} subtitle={t("settings.subtitle")} />
      <LanguageSettings />
    </div>
  );
}
