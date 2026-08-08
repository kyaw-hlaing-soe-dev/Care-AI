import { Check, Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changeCareAILanguage } from "@/i18n";
import { SUPPORTED_LANGUAGES, normalizeLanguage } from "@/i18n/languages";
import { cn } from "@/lib/utils";

export function PublicLanguageMenu({ mobile = false }: { mobile?: boolean }) {
  const { t, i18n } = useTranslation();
  const selected = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const current = SUPPORTED_LANGUAGES.find((language) => language.code === selected)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-[13px] font-bold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200",
            mobile ? "w-full px-4 text-base" : "px-3 text-sm",
          )}
          aria-label={`${t("landing.nav.language")}: ${current.nativeLabel}`}
        >
          <Globe2 className="size-4 shrink-0" aria-hidden="true" />
          <span lang={current.code}>{current.nativeLabel}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-[17px] border-white/90 bg-white/95 p-2 shadow-xl backdrop-blur-xl">
        <DropdownMenuLabel className="px-3 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-blue-600">
          {t("landing.nav.language")}
        </DropdownMenuLabel>
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onSelect={() => void changeCareAILanguage(language.code)}
            className="min-h-11 cursor-pointer justify-between rounded-[11px] px-3 font-semibold focus:bg-blue-50 focus:text-blue-700"
          >
            <span lang={language.code}>{language.nativeLabel}</span>
            {selected === language.code ? <Check className="size-4 text-blue-600" aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
