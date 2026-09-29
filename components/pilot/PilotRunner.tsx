"use client";

import { useState, useTransition } from "react";
import { startPilotCondition } from "@/app/pilot/actions";
import { formatPilot, type PilotDictionary } from "@/lib/pilot/dictionary";

interface PilotRunnerProps {
  participantCode: string;
  orderPosition: number;
  pilotDict: PilotDictionary;
}

/**
 * The condition-intro screen. Continuing provisions the participant's demo
 * craftsman account, points the real app's language/interface-mode
 * cookies at this condition, and redirects into the live /dashboard --
 * from here on, the participant is using the actual app (see
 * app/pilot/actions.ts:startPilotCondition and lib/pilot/task-hooks.ts for
 * how task completion on those real pages gets logged). They return to
 * /pilot/run/[code]/[position]/post-task once Task 4 (orders) is done.
 */
export function PilotRunner({ participantCode, orderPosition, pilotDict }: PilotRunnerProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleContinue() {
    setError(null);
    startTransition(async () => {
      const result = await startPilotCondition(participantCode, orderPosition);
      if (result && !result.success) {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-10">
      <p className="text-center text-sm font-medium text-ink-500">
        {pilotDict.common.version} {orderPosition} {pilotDict.common.of3}
      </p>

      <div className="flex flex-col items-center gap-6 rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {formatPilot(pilotDict.conditionIntro.title, { n: orderPosition })}
        </h1>
        <p className="text-ink-700">{pilotDict.conditionIntro.body}</p>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isPending}
          className="h-12 rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-60"
        >
          {isPending ? "…" : pilotDict.conditionIntro.continueButton}
        </button>
      </div>
    </div>
  );
}
