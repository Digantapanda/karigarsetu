"use client";

import { useState } from "react";
import { SUS_ITEMS } from "@/lib/pilot/sus";
import { TLX_DIMENSIONS, comprehensionItemsForCondition } from "@/lib/pilot/instruments";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import type { PilotDictionary } from "@/lib/pilot/dictionary";
import type { PilotCondition } from "@/lib/pilot/config";
import type { Locale } from "@/lib/i18n/config";
import type { PostTaskBatteryInput } from "@/lib/domain/pilot";

type Phase = "sus" | "tlx" | "comprehension" | "satisfaction" | "happiness";

const speakerClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20";

/**
 * Post-task battery, shown after each of the 3 conditions: SUS (Section H),
 * raw NASA-TLX (I), comprehension/independence (J, condition-aware so the
 * audio and icon items only appear for conditions that have them),
 * satisfaction K1-K3, and post-task happiness (L). Voice support is always
 * on here regardless of condition -- this is the measurement instrument,
 * not the interface under test, so withholding audio in the T condition
 * would make the questionnaire itself inaccessible to a low-literacy
 * participant and confound what it's measuring.
 */
export function PostTaskQuestionnaire({
  condition,
  locale,
  pilotDict,
  onSubmit,
}: {
  condition: PilotCondition;
  locale: Locale;
  pilotDict: PilotDictionary;
  onSubmit: (battery: PostTaskBatteryInput) => void;
}) {
  const [phase, setPhase] = useState<Phase>("sus");
  const [susResponses, setSusResponses] = useState<Record<number, number>>({});
  const [tlxRatings, setTlxRatings] = useState<Record<string, number>>({});
  const [comprehensionResponses, setComprehensionResponses] = useState<Record<string, number>>({});
  const [k1, setK1] = useState<number | null>(null);
  const [k2, setK2] = useState<number | null>(null);
  const [k3, setK3] = useState<number | null>(null);
  const [happiness, setHappiness] = useState<number | null>(null);

  const comprehensionItems = comprehensionItemsForCondition(condition);

  if (phase === "sus") {
    const allAnswered = SUS_ITEMS.every((item) => susResponses[item.id] !== undefined);
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-900">{pilotDict.sus.title}</h2>
          <p className="mt-1 text-sm text-ink-500">{pilotDict.sus.instruction}</p>
        </div>
        <div className="flex flex-col gap-4">
          {SUS_ITEMS.map((item) => (
            <div key={item.id} className="rounded-lg border border-ink-500/15 bg-khadi-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <p className="font-medium text-ink-900">{item.text[locale]}</p>
                <SpeakerButton text={item.text[locale]} size={16} className={speakerClass} />
              </div>
              <ScalePicker
                min={1}
                max={5}
                value={susResponses[item.id]}
                onChange={(v) => setSusResponses((r) => ({ ...r, [item.id]: v }))}
                lowLabel={pilotDict.common.scaleStronglyDisagree}
                highLabel={pilotDict.common.scaleStronglyAgree}
              />
            </div>
          ))}
        </div>
        <NextButton disabled={!allAnswered} label={pilotDict.common.next} onClick={() => setPhase("tlx")} />
      </div>
    );
  }

  if (phase === "tlx") {
    const allAnswered = TLX_DIMENSIONS.every((d) => tlxRatings[d.id] !== undefined);
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-900">{pilotDict.postTask.tlxTitle}</h2>
          <p className="mt-1 text-sm text-ink-500">{pilotDict.postTask.tlxInstruction}</p>
        </div>
        <div className="flex flex-col gap-4">
          {TLX_DIMENSIONS.map((dim) => (
            <div key={dim.id} className="rounded-lg border border-ink-500/15 bg-khadi-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <p className="font-medium text-ink-900">{dim.label[locale]}</p>
                <SpeakerButton text={dim.label[locale]} size={16} className={speakerClass} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-500">{dim.lowAnchor[locale]}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={tlxRatings[dim.id] ?? 50}
                  onChange={(e) => setTlxRatings((r) => ({ ...r, [dim.id]: Number(e.target.value) }))}
                  onPointerDown={() => setTlxRatings((r) => (r[dim.id] === undefined ? { ...r, [dim.id]: 50 } : r))}
                  className="h-2 flex-1 accent-indigo-700"
                />
                <span className="text-xs text-ink-500">{dim.highAnchor[locale]}</span>
                <span className="w-10 text-right text-sm font-medium text-ink-900">
                  {tlxRatings[dim.id] ?? "–"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <NextButton disabled={!allAnswered} label={pilotDict.common.next} onClick={() => setPhase("comprehension")} />
      </div>
    );
  }

  if (phase === "comprehension") {
    const allAnswered = comprehensionItems.every((item) => comprehensionResponses[item.id] !== undefined);
    return (
      <div className="flex flex-col gap-6">
        <h2 className="font-display text-xl font-semibold text-ink-900">{pilotDict.postTask.comprehensionTitle}</h2>
        <div className="flex flex-col gap-4">
          {comprehensionItems.map((item) => (
            <div key={item.id} className="rounded-lg border border-ink-500/15 bg-khadi-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <p className="font-medium text-ink-900">{item.text[locale]}</p>
                <SpeakerButton text={item.text[locale]} size={16} className={speakerClass} />
              </div>
              <ScalePicker
                min={1}
                max={5}
                value={comprehensionResponses[item.id]}
                onChange={(v) => setComprehensionResponses((r) => ({ ...r, [item.id]: v }))}
                lowLabel={pilotDict.common.scaleStronglyDisagree}
                highLabel={pilotDict.common.scaleStronglyAgree}
              />
            </div>
          ))}
        </div>
        <NextButton disabled={!allAnswered} label={pilotDict.common.next} onClick={() => setPhase("satisfaction")} />
      </div>
    );
  }

  if (phase === "satisfaction") {
    const allAnswered = k1 !== null && k2 !== null && k3 !== null;
    const items: { key: string; text: string; value: number | null; set: (v: number) => void }[] = [
      { key: "k1", text: pilotDict.postTask.k1, value: k1, set: setK1 },
      { key: "k2", text: pilotDict.postTask.k2, value: k2, set: setK2 },
      { key: "k3", text: pilotDict.postTask.k3, value: k3, set: setK3 },
    ];
    return (
      <div className="flex flex-col gap-6">
        <h2 className="font-display text-xl font-semibold text-ink-900">{pilotDict.postTask.satisfactionTitle}</h2>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.key} className="rounded-lg border border-ink-500/15 bg-khadi-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <p className="font-medium text-ink-900">{item.text}</p>
                <SpeakerButton text={item.text} size={16} className={speakerClass} />
              </div>
              <ScalePicker
                min={1}
                max={5}
                value={item.value ?? undefined}
                onChange={item.set}
                lowLabel={pilotDict.postTask.satisfactionScale1}
                highLabel={pilotDict.postTask.satisfactionScale5}
              />
            </div>
          ))}
        </div>
        <NextButton disabled={!allAnswered} label={pilotDict.common.next} onClick={() => setPhase("happiness")} />
      </div>
    );
  }

  // phase === "happiness"
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6">
      <div className="flex items-center gap-2">
        <p className="text-center text-lg font-medium text-ink-900">{pilotDict.postTask.postHappinessLabel}</p>
        <SpeakerButton text={pilotDict.postTask.postHappinessLabel} />
      </div>
      <div className="flex gap-4">
        {["😞", "🙁", "😐", "🙂", "😄"].map((face, i) => (
          <button
            key={face}
            type="button"
            onClick={() => setHappiness(i + 1)}
            className={[
              "flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl transition-colors",
              happiness === i + 1 ? "border-indigo-700 bg-indigo-300/20" : "border-ink-500/15 bg-khadi-50",
            ].join(" ")}
          >
            {face}
          </button>
        ))}
      </div>
      <NextButton
        disabled={happiness === null}
        label={pilotDict.common.next}
        onClick={() => {
          if (happiness === null || k1 === null || k2 === null || k3 === null) return;
          onSubmit({
            susResponses,
            tlxRatings: {
              mental: tlxRatings.mental ?? 0,
              physical: tlxRatings.physical ?? 0,
              temporal: tlxRatings.temporal ?? 0,
              performance: tlxRatings.performance ?? 0,
              effort: tlxRatings.effort ?? 0,
              frustration: tlxRatings.frustration ?? 0,
            },
            comprehensionResponses,
            k1,
            k2,
            k3,
            postTaskHappiness: happiness,
          });
        }}
      />
    </div>
  );
}

function ScalePicker({
  min,
  max,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  min: number;
  max: number;
  value: number | undefined;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className="flex items-center justify-between gap-1">
      <span className="text-xs text-ink-500">{lowLabel}</span>
      <div className="flex gap-2">
        {points.map((p) => (
          <label key={p} className="flex flex-col items-center gap-1">
            <input type="radio" checked={value === p} onChange={() => onChange(p)} className="h-6 w-6 accent-indigo-700" />
            <span className="text-xs text-ink-500">{p}</span>
          </label>
        ))}
      </div>
      <span className="text-xs text-ink-500">{highLabel}</span>
    </div>
  );
}

function NextButton({ disabled, label, onClick }: { disabled: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-12 self-start rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-40"
    >
      {label}
    </button>
  );
}
