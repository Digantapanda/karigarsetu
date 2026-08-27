import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import bn from "@/locales/bn.json";
import type { Locale, Dictionary } from "@/lib/i18n/config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, hi, bn };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * Simple {placeholder} interpolation -- e.g. t(dict.dashboardPage.welcomeBack, { name: "Ramesh" }).
 * Deliberately not a full i18n formatting library (no pluralization rules,
 * no ICU message format) -- the strings in these dictionaries don't need
 * that yet, and pulling one in would be adding a dependency this app's
 * low-cost philosophy doesn't need for three static locale files.
 */
export function format(template: string, values?: Record<string, string | number>): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match
  );
}
