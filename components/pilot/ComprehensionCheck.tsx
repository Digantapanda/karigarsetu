"use client";

import { useState } from "react";
import { SpeakerButton } from "@/components/ui/SpeakerButton";

interface ComprehensionCheckProps {
  question: string;
  options: string[];
  correctAnswer: string;
  showVoice: boolean;
  nextLabel: string;
  onAnswer: (correct: boolean) => void;
}

export function ComprehensionCheck({ question, options, correctAnswer, showVoice, nextLabel, onAnswer }: ComprehensionCheckProps) {
  const [shuffled] = useState(() => [...options].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<string | null>(null);

  function handleSubmit() {
    if (!selected) return;
    onAnswer(selected === correctAnswer);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="text-lg font-medium text-ink-900">{question}</p>
        {showVoice && <SpeakerButton text={question} />}
      </div>

      <div className="flex flex-col gap-2">
        {shuffled.map((option) => (
          <label
            key={option}
            className={[
              "flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-base",
              selected === option ? "border-indigo-700 bg-indigo-300/10" : "border-ink-500/20 bg-khadi-50",
            ].join(" ")}
          >
            <input
              type="radio"
              name="comprehension"
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
              className="h-5 w-5 accent-indigo-700"
            />
            {option}
            {showVoice && <SpeakerButton text={option} size={16} className="ml-auto flex h-7 w-7 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20" />}
          </label>
        ))}
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={handleSubmit}
        className="h-12 self-start rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}
