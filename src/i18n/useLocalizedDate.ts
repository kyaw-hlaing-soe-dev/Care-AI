import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { localeForLanguage, normalizeLanguage } from "@/i18n/languages";
import { formatRecordedAt } from "@/lib/vitals";

export function useLocalizedRecordedAt() {
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  return useCallback(
    (iso: string) => formatRecordedAt(iso, localeForLanguage(language), t("common.todayAt")),
    [language, t],
  );
}
