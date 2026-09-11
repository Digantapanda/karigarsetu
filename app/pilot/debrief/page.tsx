import { getPilotDictionary } from "@/lib/pilot/dictionary";
import type { Locale } from "@/lib/i18n/config";

interface PageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function PilotDebriefPage({ searchParams }: PageProps) {
  // The debrief screen doesn't need the participant's saved language
  // preference specifically -- it's a short, final, one-time message, so
  // English is an acceptable default here rather than another DB lookup.
  // A researcher facilitating in person can also just read it aloud.
  const locale: Locale = "en";
  const pilotDict = getPilotDictionary(locale);
  const { code } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-loom-600 text-3xl text-khadi-50">
        ✓
      </span>
      <h1 className="font-display text-2xl font-semibold text-ink-900">{pilotDict.debrief.title}</h1>
      <p className="text-ink-700">{pilotDict.debrief.body}</p>
      {code && <p className="text-sm text-ink-500">Participant code: {code}</p>}
    </main>
  );
}
