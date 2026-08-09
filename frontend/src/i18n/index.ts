import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/i18n/locales/en";
import my from "@/i18n/locales/my";
import zhCN from "@/i18n/locales/zh-CN";
import { LANGUAGE_STORAGE_KEY, type LanguageCode } from "@/i18n/languages";

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    my: { translation: my },
    "zh-CN": { translation: zhCN },
  },
  // Keep SSR and the first client render identical. LanguageProvider applies
  // the persisted preference after hydration before revealing page content.
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "my", "zh-CN"],
  nonExplicitSupportedLngs: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  returnEmptyString: false,
});

export async function changeCareAILanguage(language: LanguageCode) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
  await i18n.changeLanguage(language);
}

export default i18n;
