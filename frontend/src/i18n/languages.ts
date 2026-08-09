export const LANGUAGE_STORAGE_KEY = "careai-language";

export const SUPPORTED_LANGUAGES = [
  { code: "en", nativeLabel: "English", englishLabel: "English" },
  { code: "my", nativeLabel: "မြန်မာ", englishLabel: "Myanmar" },
  { code: "zh-CN", nativeLabel: "简体中文", englishLabel: "Chinese (Simplified)" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export function isLanguageCode(value: unknown): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
}

export function normalizeLanguage(value: unknown): LanguageCode {
  return isLanguageCode(value) ? value : "en";
}

export function localeForLanguage(language: LanguageCode) {
  if (language === "my") return "my-MM-u-nu-latn";
  if (language === "zh-CN") return "zh-CN-u-nu-latn";
  return "en-US-u-nu-latn";
}
