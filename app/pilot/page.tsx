import Link from "next/link";
import { getPilotDictionary } from "@/lib/pilot/dictionary";
import type { Locale } from "@/lib/i18n/config";

const LANG_LABELS: Record<Locale, string> = { en: "English", hi: "हिन्दी", bn: "বাংলা" };

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function PilotConsentPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  const locale: Locale = lang === "hi" || lang === "bn" ? lang : "en";
  const pilotDict = getPilotDictionary(locale);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div className="flex justify-center gap-2">
        {(Object.keys(LANG_LABELS) as Locale[]).map((code) => (
          <Link
            key={code}
            href={`/pilot?lang=${code}`}
            className={[
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              code === locale ? "bg-indigo-700 text-khadi-50" : "bg-khadi-50 text-ink-700 hover:bg-ink-900/5",
            ].join(" ")}
          >
            {LANG_LABELS[code]}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-ink-900">{pilotDict.consent.title}</h1>
        <p className="mt-3 whitespace-pre-line text-ink-700">{pilotDict.consent.body}</p>
        <Link
          href={`/pilot/intake?lang=${locale}`}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-indigo-700 px-6 text-base font-semibold text-khadi-50 hover:bg-indigo-900"
        >
          {pilotDict.consent.agree}
        </Link>
      </div>
    </main>
  );
}
