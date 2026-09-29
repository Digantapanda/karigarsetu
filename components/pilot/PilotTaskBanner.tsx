"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reportPilotTask, recordPilotAssistance } from "@/app/pilot/task-actions";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import type { PilotDictionary } from "@/lib/pilot/dictionary";

interface PilotTaskBannerProps {
  taskPosition: 1 | 2 | 3 | 4;
  pilotDict: PilotDictionary;
}

const INSTRUCTION_BY_POSITION: (dict: PilotDictionary) => Record<1 | 2 | 3 | 4, string> = (dict) => ({
  1: dict.liveTasks.task1Instruction,
  2: dict.liveTasks.task2Instruction,
  3: dict.liveTasks.task3Instruction,
  4: dict.liveTasks.task4Instruction,
});

/**
 * Rendered from the root layout whenever an active pilot session cookie is
 * present (see app/layout.tsx). Only Task 1 ("look at your dashboard") has
 * a manual done button -- it's the one task with no real action to detect
 * completion from; Tasks 2-4 advance automatically when the corresponding
 * real action happens (product created, mail shared, orders decided).
 */
export function PilotTaskBanner({ taskPosition, pilotDict }: PilotTaskBannerProps) {
  const [showHint, setShowHint] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const instruction = INSTRUCTION_BY_POSITION(pilotDict)[taskPosition];

  function handleHelp() {
    setShowHint(true);
    startTransition(async () => {
      await recordPilotAssistance();
    });
  }

  function handleTask1Done() {
    startTransition(async () => {
      await reportPilotTask("dashboard_view");
      router.refresh();
    });
  }

  return (
    <div className="sticky top-0 z-40 border-b border-turmeric-500/40 bg-turmeric-100 px-4 py-3">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-ink-900">{instruction}</p>
          <SpeakerButton
            text={instruction}
            size={16}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
          />
        </div>
        <div className="flex items-center gap-2">
          {taskPosition === 1 && (
            <button
              type="button"
              onClick={handleTask1Done}
              disabled={isPending}
              className="h-9 rounded-lg bg-indigo-700 px-4 text-sm font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-60"
            >
              {pilotDict.liveTasks.taskDoneButton}
            </button>
          )}
          <button
            type="button"
            onClick={handleHelp}
            className="h-9 rounded-lg border-2 border-turmeric-500 px-3 text-sm font-semibold text-turmeric-600 hover:bg-turmeric-100"
          >
            {pilotDict.helpButton.label}
          </button>
        </div>
      </div>
      {showHint && <p className="mx-auto mt-1 w-full max-w-4xl text-xs text-ink-500">{pilotDict.helpButton.hintShown}</p>}
    </div>
  );
}
