import { setLocale } from "@/app/actions/locale";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";

export function LanguageSelector({ current }: { current: Locale }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-ink-500/15 bg-khadi-50 p-1">
      {LOCALES.map((locale) => (
        <form key={locale} action={setLocale}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            aria-current={locale === current ? "true" : undefined}
            className={[
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              locale === current
                ? "bg-indigo-700 text-khadi-50"
                : "text-ink-700 hover:bg-ink-900/5",
            ].join(" ")}
          >
            {LOCALE_LABELS[locale]}
          </button>
        </form>
      ))}
    </div>
  );
}
