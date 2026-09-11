import { IntakeForm } from "@/components/pilot/IntakeForm";
import { getPilotDictionary } from "@/lib/pilot/dictionary";
import type { Locale } from "@/lib/i18n/config";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function PilotIntakePage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  const locale: Locale = lang === "hi" || lang === "bn" ? lang : "en";
  const pilotDict = getPilotDictionary(locale);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink-900">{pilotDict.intake.title}</h1>
      <div className="rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 shadow-sm sm:p-8">
        <IntakeForm pilotDict={pilotDict} defaultLanguage={locale} />
      </div>
    </main>
  );
}
