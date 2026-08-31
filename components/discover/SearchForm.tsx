"use client";

import { useRef } from "react";
import { translatedCraftCategoryOptions } from "@/lib/domain/craft-categories";
import { INDIAN_STATES } from "@/lib/domain/indian-states";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { MicButton } from "@/components/ui/MicButton";
import { useVoiceConfig } from "@/lib/voice/VoiceConfigContext";
import type { Dictionary } from "@/lib/i18n/config";

interface SearchFormProps {
  query?: string;
  categoryId?: string;
  state?: string;
  dict: Dictionary;
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

// A GET <form> -- still works without JavaScript (submitting reloads
// /discover with the chosen filters as query params, read server-side,
// per architecture doc §17/§24 for low-bandwidth/older devices). Voice is
// an enhancement layered on top for people who have JS, not a replacement
// for the base form.
export function SearchForm({ query, categoryId, state, dict }: SearchFormProps) {
  const queryRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const { dict: voiceDict } = useVoiceConfig();

  const categoryOptions = translatedCraftCategoryOptions(dict);
  const stateOptions = INDIAN_STATES.map((s) => ({ value: s, label: s }));

  function fillInput(ref: React.RefObject<HTMLInputElement | null>, value: string) {
    const el = ref.current;
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    setter?.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function selectMatchingOption(
    ref: React.RefObject<HTMLSelectElement | null>,
    transcript: string,
    options: { value: string; label: string }[]
  ) {
    const el = ref.current;
    const spoken = normalize(transcript);
    const match =
      options.find((o) => normalize(o.label) === spoken) ??
      options.find((o) => spoken.includes(normalize(o.label))) ??
      options.find((o) => normalize(o.label).includes(spoken));
    if (!el || !match) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
    setter?.call(el, match.value);
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  return (
    <form action="/discover" method="get" className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="q" className="text-sm font-medium text-ink-900">
          {dict.discoverPage.searchLabel}
        </label>
        <div className="flex items-center gap-1">
          <input
            id="q"
            name="q"
            ref={queryRef}
            type="text"
            defaultValue={query}
            placeholder={dict.discoverPage.searchPlaceholder}
            className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 placeholder:text-ink-500/60 focus:border-indigo-500"
          />
          <SpeakerButton text={dict.discoverPage.searchLabel} />
          <MicButton onResult={(t) => fillInput(queryRef, t)} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-52">
        <label htmlFor="category" className="text-sm font-medium text-ink-900">
          {dict.discoverPage.categoryLabel}
        </label>
        <div className="flex items-center gap-1">
          <select
            id="category"
            name="category"
            ref={categoryRef}
            defaultValue={categoryId ?? ""}
            className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 focus:border-indigo-500"
          >
            <option value="">{dict.discoverPage.allCrafts}</option>
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <SpeakerButton
            text={`${dict.discoverPage.categoryLabel}. ${voiceDict.common.optionsAre} ${categoryOptions.map((c) => c.label).join(", ")}`}
          />
          <MicButton onResult={(t) => selectMatchingOption(categoryRef, t, categoryOptions)} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-52">
        <label htmlFor="state" className="text-sm font-medium text-ink-900">
          {dict.discoverPage.stateLabel}
        </label>
        <div className="flex items-center gap-1">
          <select
            id="state"
            name="state"
            ref={stateRef}
            defaultValue={state ?? ""}
            className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 focus:border-indigo-500"
          >
            <option value="">{dict.discoverPage.allStates}</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <SpeakerButton text={dict.discoverPage.stateLabel} />
          <MicButton onResult={(t) => selectMatchingOption(stateRef, t, stateOptions)} />
        </div>
      </div>

      <button
        type="submit"
        className="h-12 rounded-lg bg-indigo-700 px-6 text-base font-semibold text-khadi-50 hover:bg-indigo-900"
      >
        {dict.discoverPage.searchButton}
      </button>
    </form>
  );
}
