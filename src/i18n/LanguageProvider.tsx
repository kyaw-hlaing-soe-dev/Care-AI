import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { changeCareAILanguage } from "@/i18n";
import { LANGUAGE_STORAGE_KEY, normalizeLanguage } from "@/i18n/languages";
import { useProfile } from "@/lib/profile-context";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (loading) return;
    const storedLanguage =
      typeof window === "undefined"
        ? "en"
        : normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
    const language = normalizeLanguage(profile?.preferredLanguage ?? storedLanguage);
    void changeCareAILanguage(language);
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

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
