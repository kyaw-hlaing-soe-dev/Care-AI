import { useEffect, useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { changeCareAILanguage } from "@/i18n";
import { LANGUAGE_STORAGE_KEY, normalizeLanguage } from "@/i18n/languages";
import { useProfile } from "@/lib/profile-context";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile, loading } = useProfile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    let active = true;
    const storedLanguage =
      typeof window === "undefined"
        ? "en"
        : normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
    const language = normalizeLanguage(profile?.preferredLanguage ?? storedLanguage);
    void changeCareAILanguage(language).finally(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [loading, profile?.preferredLanguage]);

  useEffect(() => {
    const syncDocumentLanguage = (language: string) => {
      const normalized = normalizeLanguage(language);
      document.documentElement.lang = normalized;
      document.documentElement.dataset["language"] = normalized;
    };
    syncDocumentLanguage(i18n.resolvedLanguage ?? i18n["language"]);
    i18n.on("languageChanged", syncDocumentLanguage);
    return () => i18n.off("languageChanged", syncDocumentLanguage);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {ready ? (
        children
      ) : (
        <div
          className="flex min-h-screen items-center justify-center bg-background"
          role="status"
          aria-label={i18n.t("common.loadingLanguage")}
        >
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        </div>
      )}
    </I18nextProvider>
  );
}
