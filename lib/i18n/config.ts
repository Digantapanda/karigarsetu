import en from "@/locales/en.json";

export const LOCALES = ["en", "hi", "bn"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  bn: "বাংলা",
};

export const LOCALE_COOKIE = "locale";

// BCP-47 codes for the Web Speech API (SpeechRecognition lang, SpeechSynthesisUtterance.lang).
// Separate from the UI locale codes above because speech APIs want the
// fuller region-tagged form.
export const SPEECH_LOCALE: Record<Locale, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
};

// en.json is the canonical shape every other locale file must match.
export type Dictionary = typeof en;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
