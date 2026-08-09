import { Check, Languages, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { GlassCard } from "@/components/glass/GlassCard";
import { changeCareAILanguage } from "@/i18n";
import { SUPPORTED_LANGUAGES, normalizeLanguage, type LanguageCode } from "@/i18n/languages";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { cn } from "@/lib/utils";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { profile, updatePreferredLanguage } = useProfile();
  const [saving, setSaving] = useState<LanguageCode | null>(null);
  const selected = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  async function selectLanguage(language: LanguageCode) {
    if (language === selected || saving) return;
    setSaving(language);
    await changeCareAILanguage(language);
    try {
      if (user && profile) await updatePreferredLanguage(language);
      toast.success(i18n.t("common.languageUpdated"));
    } catch {
      toast.error(i18n.t("errors.savePreferences"));
    } finally {
      setSaving(null);
    }
  }

  return (
    <>
      <div className="grid gap-2.5" role="radiogroup" aria-label={t("settings.language")}>
        {SUPPORTED_LANGUAGES.map((language) => {
          const checked = selected === language.code;
          const pending = saving === language.code;
          return (
            <button
              key={language.code}
              type="button"
              role="radio"
              aria-checked={checked}
              disabled={Boolean(saving)}
              onClick={() => void selectLanguage(language.code)}
              className={cn(
                "flex w-full items-center gap-4 rounded-[15px] border text-left transition-[border-color,background-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:cursor-wait",
                compact ? "min-h-[60px] px-3.5 py-3" : "min-h-16 p-4 sm:min-h-[68px] sm:px-5",
                checked
                  ? "border-blue-300 bg-blue-50/85 shadow-[0_8px_22px_rgba(37,99,235,0.09)]"
                  : "border-slate-200 bg-white/80 hover:-translate-y-px hover:border-blue-200 hover:bg-blue-50/35",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border",
                  checked ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white",
                )}
                aria-hidden="true"
              >
                {pending ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : checked ? (
                  <Check className="size-3.5" strokeWidth={3} />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-base leading-6 text-slate-950",
                    checked ? "font-extrabold" : "font-bold",
                  )}
                  lang={language.code}
                >
                  {language.nativeLabel}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                  {language.englishLabel}
                  {language.code === "en" ? ` · ${t("common.default")}` : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">{t("settings.saved")}</p>
    </>
  );
}

export function LanguageSettings() {
  const { t } = useTranslation();
  return (
    <GlassCard strong className="app-card p-5 sm:p-7 lg:p-8">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.03em] text-slate-950">
          <Languages className="size-5 shrink-0 text-blue-500" aria-hidden="true" />
          {t("settings.language")}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-slate-500">{t("settings.languageBody")}</p>
      </div>
      <div className="mt-5">
        <LanguageSelector />
      </div>
    </GlassCard>
  );
}
