import Link from "next/link";
import { ClipboardList, Layers, MessageSquareText, Clock, ShieldCheck, Hand } from "lucide-react";
import { getPilotDictionary } from "@/lib/pilot/dictionary";
import type { Locale } from "@/lib/i18n/config";

const LANG_LABELS: Record<Locale, string> = { en: "English", hi: "हिन्दी", bn: "বাংলা" };

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function PilotLandingPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  const locale: Locale = lang === "hi" || lang === "bn" ? lang : "en";
  const t = getPilotDictionary(locale).landing;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-12">
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
        <h1 className="font-display text-2xl font-semibold text-ink-900">{t.title}</h1>
        <p className="mt-2 text-ink-700">{t.intro}</p>

        <div className="mt-6 flex flex-col gap-5">
          <section className="flex gap-3">
            <ClipboardList size={24} className="mt-0.5 shrink-0 text-indigo-700" />
            <div>
              <h2 className="font-semibold text-ink-900">{t.purposeLabel}</h2>
              <p className="text-sm text-ink-700">{t.purposeText}</p>
            </div>
          </section>

          <section className="flex gap-3">
            <Layers size={24} className="mt-0.5 shrink-0 text-indigo-700" />
            <div>
              <h2 className="font-semibold text-ink-900">{t.stepsLabel}</h2>
              <ol className="mt-1 flex flex-col gap-1 text-sm text-ink-700">
                <li>1. {t.step1}</li>
                <li>2. {t.step2}</li>
                <li>3. {t.step3}</li>
                <li>4. {t.step4}</li>
              </ol>
            </div>
          </section>

          <section className="flex gap-3">
            <Clock size={24} className="mt-0.5 shrink-0 text-indigo-700" />
            <div>
              <h2 className="font-semibold text-ink-900">{t.durationLabel}</h2>
              <p className="text-sm text-ink-700">{t.durationText}</p>
            </div>
          </section>

          <section className="flex gap-3">
            <ShieldCheck size={24} className="mt-0.5 shrink-0 text-indigo-700" />
            <div>
              <h2 className="font-semibold text-ink-900">{t.confidentialityLabel}</h2>
              <p className="text-sm text-ink-700">{t.confidentialityText}</p>
            </div>
          </section>

          <section className="flex gap-3">
            <Hand size={24} className="mt-0.5 shrink-0 text-indigo-700" />
            <div>
              <h2 className="font-semibold text-ink-900">{t.voluntaryLabel}</h2>
              <p className="text-sm text-ink-700">{t.voluntaryText}</p>
            </div>
          </section>
        </div>

        <Link
          href={`/pilot/intake?lang=${locale}`}
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-6 text-base font-semibold text-khadi-50 hover:bg-indigo-900"
        >
          <MessageSquareText size={18} aria-hidden="true" />
          {t.continueButton}
        </Link>
      </div>
    </main>
  );
}
