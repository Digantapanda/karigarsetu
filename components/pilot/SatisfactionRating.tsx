"use client";

import { useState } from "react";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import type { PilotDictionary } from "@/lib/pilot/dictionary";

const FACES = ["😞", "🙁", "😐", "🙂", "😄"];

export function SatisfactionRating({
  pilotDict,
  onSubmit,
}: {
  pilotDict: PilotDictionary;
  onSubmit: (score: number) => void;
}) {
  const [score, setScore] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6">
      <div className="flex items-center gap-2">
        <p className="text-center text-lg font-medium text-ink-900">{pilotDict.satisfaction.question}</p>
        <SpeakerButton text={pilotDict.satisfaction.question} />
      </div>

      <div className="flex gap-4">
        {FACES.map((face, i) => {
          const value = i + 1;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setScore(value)}
              aria-label={String(value)}
              className={[
                "flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl transition-colors",
                score === value ? "border-indigo-700 bg-indigo-300/20" : "border-ink-500/15 bg-khadi-50",
              ].join(" ")}
            >
              {face}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={score === null}
        onClick={() => score !== null && onSubmit(score)}
        className="h-12 rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-40"
      >
        {pilotDict.common.next}
      </button>
    </div>
  );
}
