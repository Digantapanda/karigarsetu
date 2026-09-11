"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { SelectField } from "@/components/ui/SelectField";
import { HelpButton } from "@/components/pilot/HelpButton";
import type { PilotCondition } from "@/lib/pilot/config";
import type { PilotDictionary } from "@/lib/pilot/dictionary";

interface TaskProfileInfoProps {
  condition: PilotCondition;
  sessionId: string;
  pilotDict: PilotDictionary;
  craftOptions: { value: string; label: string }[];
  onDone: (data: { name: string; craftId: string }) => void;
}

export function TaskProfileInfo({ condition, sessionId, pilotDict, craftOptions, onDone }: TaskProfileInfoProps) {
  const [name, setName] = useState("");
  const [craftId, setCraftId] = useState("");
  const isAudio = condition === "TA" || condition === "TAI";
  const isIcon = condition === "TAI";
  const t = pilotDict.taskProfileInfo;

  const canSubmit = name.trim().length > 0 && craftId !== "";

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-medium text-ink-900">{t.instruction}</p>

      <div className={isIcon ? "flex flex-col gap-6 rounded-2xl bg-khadi-50 p-6" : "flex flex-col gap-5"}>
        {isIcon && (
          <div className="flex justify-center">
            <Palette size={56} className="text-indigo-700" />
          </div>
        )}
        <Field
          label={t.nameLabel}
          value={name}
          onChange={(e) => setName(e.target.value)}
          voice={isAudio}
        />
        <SelectField
          label={t.craftLabel}
          placeholder={t.craftPlaceholder}
          options={craftOptions}
          value={craftId}
          onChange={(e) => setCraftId(e.target.value)}
          voice={isAudio}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onDone({ name, craftId })}
          className="h-12 rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-40"
        >
          {t.doneButton}
        </button>
        <HelpButton sessionId={sessionId} taskKey="profile_info" pilotDict={pilotDict} />
      </div>
    </div>
  );
}
