"use client";

import { useState, useTransition } from "react";
import { submitFinalFeedbackAction } from "@/app/pilot/actions";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import type { PilotDictionary } from "@/lib/pilot/dictionary";
import type { PilotCondition } from "@/lib/pilot/config";

type Helpful = "text" | "audio" | "icons" | "combination" | "none";

const speakerClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20";

/**
 * Interface Preference (M1-M4), asked once after all three conditions.
 * M1 offers the three interfaces by their plain descriptions plus "no
 * preference"; the actual condition is resolved from the label chosen, so
 * the answer is recorded as T/TA/TAI/no_preference regardless of the
 * order the participant experienced them in.
 */
export function FinalFeedbackForm({
  participantId,
  participantCode,
  pilotDict,
}: {
  participantId: string;
  participantCode: string;
  pilotDict: PilotDictionary;
}) {
  const t = pilotDict.finalFeedback;
  const [preferred, setPreferred] = useState<PilotCondition | "no_preference" | "">("");
  const [helpful, setHelpful] = useState<Helpful | "">("");
  const [difficult, setDifficult] = useState("");
  const [wouldHelp, setWouldHelp] = useState("");
  const [isPending, startTransition] = useTransition();

  const canSubmit = preferred !== "" && helpful !== "";

  function handleSubmit() {
    if (preferred === "" || helpful === "") return;
    startTransition(async () => {
      await submitFinalFeedbackAction(participantId, participantCode, preferred, helpful, difficult, wouldHelp);
    });
  }

  const m1Options: { value: PilotCondition | "no_preference"; label: string }[] = [
    { value: "T", label: t.m1TextOnly },
    { value: "TA", label: t.m1TextAudio },
    { value: "TAI", label: t.m1TextAudioIcons },
    { value: "no_preference", label: t.m1NoPreference },
  ];
  const m2Options: { value: Helpful; label: string }[] = [
    { value: "text", label: t.m2Text },
    { value: "audio", label: t.m2Audio },
    { value: "icons", label: t.m2Icons },
    { value: "combination", label: t.m2Combination },
    { value: "none", label: t.m2None },
  ];

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 flex items-center gap-2 text-lg font-medium text-ink-900">
          {t.m1Question}
          <SpeakerButton text={t.m1Question} size={16} className={speakerClass} />
        </legend>
        {m1Options.map((opt) => (
          <label
            key={opt.value}
            className={[
              "flex items-center gap-3 rounded-lg border-2 px-4 py-3",
              preferred === opt.value ? "border-indigo-700 bg-indigo-300/10" : "border-ink-500/20 bg-khadi-50",
            ].join(" ")}
          >
            <input type="radio" name="m1" checked={preferred === opt.value} onChange={() => setPreferred(opt.value)} className="h-5 w-5 accent-indigo-700" />
            <span className="text-base font-medium text-ink-900">{opt.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 flex items-center gap-2 text-lg font-medium text-ink-900">
          {t.m2Question}
          <SpeakerButton text={t.m2Question} size={16} className={speakerClass} />
        </legend>
        {m2Options.map((opt) => (
          <label
            key={opt.value}
            className={[
              "flex items-center gap-3 rounded-lg border-2 px-4 py-3",
              helpful === opt.value ? "border-indigo-700 bg-indigo-300/10" : "border-ink-500/20 bg-khadi-50",
            ].join(" ")}
          >
            <input type="radio" name="m2" checked={helpful === opt.value} onChange={() => setHelpful(opt.value)} className="h-5 w-5 accent-indigo-700" />
            <span className="text-base font-medium text-ink-900">{opt.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="m3" className="flex items-center gap-2 text-lg font-medium text-ink-900">
          {t.m3Question}
          <SpeakerButton text={t.m3Question} size={16} className={speakerClass} />
        </label>
        <textarea id="m3" rows={3} value={difficult} onChange={(e) => setDifficult(e.target.value)} className="w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 py-3 text-base text-ink-900 focus:border-indigo-500" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="m4" className="flex items-center gap-2 text-lg font-medium text-ink-900">
          {t.m4Question}
          <SpeakerButton text={t.m4Question} size={16} className={speakerClass} />
        </label>
        <textarea id="m4" rows={3} value={wouldHelp} onChange={(e) => setWouldHelp(e.target.value)} className="w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 py-3 text-base text-ink-900 focus:border-indigo-500" />
      </div>

      <button
        type="button"
        disabled={!canSubmit || isPending}
        onClick={handleSubmit}
        className="h-12 self-start rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-40"
      >
        {t.submit}
      </button>
    </div>
  );
}
