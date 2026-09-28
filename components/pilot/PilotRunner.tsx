"use client";

import { useEffect, useState, useTransition } from "react";
import { recordSessionStart, submitPostTaskBatteryAction } from "@/app/pilot/actions";
import { PostTaskQuestionnaire } from "@/components/pilot/PostTaskQuestionnaire";
import { formatPilot, type PilotDictionary } from "@/lib/pilot/dictionary";
import type { PilotCondition } from "@/lib/pilot/config";
import type { Locale } from "@/lib/i18n/config";
import type { PostTaskBatteryInput } from "@/lib/domain/pilot";

type Step = "intro" | "postTask";

interface PilotRunnerProps {
  sessionId: string;
  participantId: string;
  participantCode: string;
  condition: PilotCondition;
  orderPosition: number;
  locale: Locale;
  pilotDict: PilotDictionary;
}

/**
 * Per-condition flow: intro -> post-task questionnaire.
 *
 * NOT YET BUILT: the middle step where the participant actually performs
 * the four tasks on the real app (dashboard, add product, view profile +
 * share by mail, view orders). That needs auto-provisioned demo craftsman
 * accounts, a pilot-mode flag on the real pages, pointer tracking, and a
 * mock Orders screen -- a separate, large piece of work. Until it lands,
 * this runner goes straight from the condition intro to the questionnaire.
 */
export function PilotRunner({
  sessionId,
  participantId,
  participantCode,
  condition,
  orderPosition,
  locale,
  pilotDict,
}: PilotRunnerProps) {
  const [step, setStep] = useState<Step>("intro");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      await recordSessionStart(sessionId);
    });
  }, [sessionId]);

  function handleBatterySubmit(battery: PostTaskBatteryInput) {
    startTransition(async () => {
      await submitPostTaskBatteryAction(participantCode, participantId, sessionId, orderPosition, battery);
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-10">
      <p className="text-center text-sm font-medium text-ink-500">
        {pilotDict.common.version} {orderPosition} {pilotDict.common.of3}
      </p>

      {step === "intro" && (
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            {formatPilot(pilotDict.conditionIntro.title, { n: orderPosition })}
          </h1>
          <p className="text-ink-700">{pilotDict.conditionIntro.body}</p>
          <button
            type="button"
            onClick={() => setStep("postTask")}
            disabled={isPending}
            className="h-12 rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900"
          >
            {pilotDict.conditionIntro.continueButton}
          </button>
        </div>
      )}

      {step === "postTask" && (
        <PostTaskQuestionnaire
          condition={condition}
          locale={locale}
          pilotDict={pilotDict}
          onSubmit={handleBatterySubmit}
        />
      )}
    </div>
  );
}
