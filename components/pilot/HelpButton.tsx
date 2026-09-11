"use client";

import { useState, useTransition } from "react";
import { recordAssistance } from "@/app/pilot/actions";
import type { TaskKey } from "@/lib/pilot/config";
import type { PilotDictionary } from "@/lib/pilot/dictionary";

export function HelpButton({
  sessionId,
  taskKey,
  pilotDict,
}: {
  sessionId: string;
  taskKey: TaskKey;
  pilotDict: PilotDictionary;
}) {
  const [showHint, setShowHint] = useState(false);
  const [, startTransition] = useTransition();

  function handleClick() {
    setShowHint(true);
    startTransition(async () => {
      await recordAssistance(sessionId, taskKey);
    });
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        className="rounded-lg border-2 border-turmeric-500 px-4 py-2 text-sm font-semibold text-turmeric-600 hover:bg-turmeric-100"
      >
        {pilotDict.helpButton.label}
      </button>
      {showHint && <p className="text-sm text-ink-500">{pilotDict.helpButton.hintShown}</p>}
    </div>
  );
}
