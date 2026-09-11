"use client";

import { useState } from "react";
import { SUS_ITEMS } from "@/lib/pilot/sus";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import type { PilotDictionary } from "@/lib/pilot/dictionary";
import type { Locale } from "@/lib/i18n/config";

export function SusSurvey({
  pilotDict,
  locale,
  onSubmit,
}: {
  pilotDict: PilotDictionary;
  locale: Locale;
  onSubmit: (responses: Record<number, number>) => void;
}) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const allAnswered = SUS_ITEMS.every((item) => responses[item.id] !== undefined);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink-900">{pilotDict.sus.title}</h2>
        <p className="mt-1 text-sm text-ink-500">{pilotDict.sus.instruction}</p>
      </div>

      <div className="flex flex-col gap-5">
        {SUS_ITEMS.map((item) => (
          <div key={item.id} className="rounded-lg border border-ink-500/15 bg-khadi-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <p className="font-medium text-ink-900">{item.text[locale]}</p>
              <SpeakerButton text={item.text[locale]} size={16} className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20" />
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs text-ink-500">{pilotDict.common.scaleStronglyDisagree}</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex flex-col items-center gap-1">
                    <input
                      type="radio"
                      name={`sus-${item.id}`}
                      value={value}
                      checked={responses[item.id] === value}
                      onChange={() => setResponses((r) => ({ ...r, [item.id]: value }))}
                      className="h-6 w-6 accent-indigo-700"
                    />
                    <span className="text-xs text-ink-500">{value}</span>
                  </label>
                ))}
              </div>
              <span className="text-xs text-ink-500">{pilotDict.common.scaleStronglyAgree}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={!allAnswered}
        onClick={() => onSubmit(responses)}
        className="h-12 self-start rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-40"
      >
        {pilotDict.common.next}
      </button>
    </div>
  );
}
