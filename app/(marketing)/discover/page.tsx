import type { Metadata } from "next";
import { searchCraftsmen } from "@/lib/domain/craftsman";
import { SearchForm } from "@/components/discover/SearchForm";
import { CraftsmanCard } from "@/components/discover/CraftsmanCard";
import { SpeakableText } from "@/components/ui/SpeakableText";
import { VoiceConfigProvider } from "@/lib/voice/VoiceConfigContext";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SPEECH_LOCALE } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Find a Craftsman -- KarigarSetu",
  description: "Search verified Indian craftsmen by craft, name, or state.",
};

interface DiscoverPageProps {
  searchParams: Promise<{ q?: string; category?: string; state?: string }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const { q, category, state } = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const results = await searchCraftsmen({ query: q, categoryId: category, state });
  const hasActiveFilters = Boolean(q || category || state);

  return (
    <VoiceConfigProvider lang={SPEECH_LOCALE[locale]} dict={dict}>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:py-14">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.discoverPage.eyebrow}</p>
          <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            {dict.discoverPage.heading}
          </h1>
          <SpeakableText text={dict.discoverPage.subheading} className="max-w-prose text-ink-700" />
        </header>

        <SearchForm query={q} categoryId={category} state={state} dict={dict} />

        {results.length === 0 ? (
          <div className="rounded-2xl border border-ink-500/15 bg-khadi-50 p-10 text-center">
            <SpeakableText
              text={hasActiveFilters ? dict.discoverPage.noneMatchTitle : dict.discoverPage.noneListedTitle}
              className="font-medium text-ink-900"
            />
            <p className="mt-1 text-sm text-ink-500">
              {hasActiveFilters ? dict.discoverPage.noneMatchHint : dict.discoverPage.noneListedHint}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {results.map((craftsman) => (
              <CraftsmanCard key={craftsman.id} craftsman={craftsman} dict={dict} />
            ))}
          </div>
        )}
      </main>
    </VoiceConfigProvider>
  );
}
