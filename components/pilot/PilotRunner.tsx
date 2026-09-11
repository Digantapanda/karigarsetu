"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  recordSessionStart,
  recordTaskStart,
  recordTaskError,
  recordTaskComplete,
  submitSessionSurvey,
} from "@/app/pilot/actions";
import { TaskProfileInfo } from "@/components/pilot/TaskProfileInfo";
import { TaskShareProfile } from "@/components/pilot/TaskShareProfile";
import { ComprehensionCheck } from "@/components/pilot/ComprehensionCheck";
import { SusSurvey } from "@/components/pilot/SusSurvey";
import { SatisfactionRating } from "@/components/pilot/SatisfactionRating";
import { formatPilot, type PilotDictionary } from "@/lib/pilot/dictionary";
import type { PilotCondition } from "@/lib/pilot/config";
import type { Locale } from "@/lib/i18n/config";

type Step = "intro" | "task1" | "comprehension1" | "task2" | "comprehension2" | "sus" | "satisfaction";

interface PilotRunnerProps {
  sessionId: string;
  participantCode: string;
  condition: PilotCondition;
  orderPosition: number;
  locale: Locale;
  pilotDict: PilotDictionary;
  craftOptions: { value: string; label: string }[];
}

function pickDistractors(correctLabel: string, allLabels: string[], count: number): string[] {
  const pool = allLabels.filter((l) => l !== correctLabel);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function PilotRunner({
  sessionId,
  participantCode,
  condition,
  orderPosition,
  locale,
  pilotDict,
  craftOptions,
}: PilotRunnerProps) {
  const [step, setStep] = useState<Step>("intro");
  const [task1Data, setTask1Data] = useState<{ name: string; craftId: string } | null>(null);
  const susResponsesRef = useRef<Record<number, number>>({});
  const [isPending, startTransition] = useTransition();
  const isAudio = condition === "TA" || condition === "TAI";

  useEffect(() => {
    startTransition(async () => {
      await recordSessionStart(sessionId);
    });
  }, [sessionId]);

  function beginTask1() {
    setStep("task1");
    startTransition(async () => {
      await recordTaskStart(sessionId, "profile_info");
    });
  }

  function beginTask2() {
    setStep("task2");
    startTransition(async () => {
      await recordTaskStart(sessionId, "share_profile");
    });
  }

  function handleTask1Done(data: { name: string; craftId: string }) {
    setTask1Data(data);
    setStep("comprehension1");
  }

  function handleComprehension1(correct: boolean) {
    const success = Boolean(task1Data?.name && task1Data?.craftId);
    startTransition(async () => {
      await recordTaskComplete(sessionId, "profile_info", success, correct);
    });
    beginTask2();
  }

  function handleTask2Error() {
    startTransition(async () => {
      await recordTaskError(sessionId, "share_profile");
    });
  }

  function handleTask2Done() {
    setStep("comprehension2");
  }

  function handleComprehension2(correct: boolean) {
    startTransition(async () => {
      await recordTaskComplete(sessionId, "share_profile", true, correct);
    });
    setStep("sus");
  }

  function handleSusSubmit(susResponses: Record<number, number>) {
    susResponsesRef.current = susResponses;
    setStep("satisfaction");
  }

  function handleSatisfactionSubmit(satisfactionScore: number) {
    startTransition(async () => {
      await submitSessionSurvey(participantCode, sessionId, orderPosition, susResponsesRef.current, satisfactionScore);
    });
  }

  const craftLabelById = new Map(craftOptions.map((o) => [o.value, o.label]));
  const allCraftLabels = craftOptions.map((o) => o.label);
  const selectedCraftLabel = task1Data ? craftLabelById.get(task1Data.craftId) ?? "" : "";

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
            onClick={beginTask1}
            disabled={isPending}
            className="h-12 rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900"
          >
            {pilotDict.conditionIntro.continueButton}
          </button>
        </div>
      )}

      {step === "task1" && (
        <TaskProfileInfo
          condition={condition}
          sessionId={sessionId}
          pilotDict={pilotDict}
          craftOptions={craftOptions}
          onDone={handleTask1Done}
        />
      )}

      {step === "comprehension1" && selectedCraftLabel && (
        <ComprehensionCheck
          question={pilotDict.taskProfileInfo.comprehensionQuestion}
          options={[selectedCraftLabel, ...pickDistractors(selectedCraftLabel, allCraftLabels, 2)]}
          correctAnswer={selectedCraftLabel}
          showVoice={isAudio}
          nextLabel={pilotDict.common.next}
          onAnswer={handleComprehension1}
        />
      )}

      {step === "task2" && (
        <TaskShareProfile
          condition={condition}
          sessionId={sessionId}
          pilotDict={pilotDict}
          onError={handleTask2Error}
          onDone={handleTask2Done}
        />
      )}

      {step === "comprehension2" && (
        <ComprehensionCheck
          question={pilotDict.taskShareProfile.comprehensionQuestion}
          options={[
            pilotDict.taskShareProfile.comprehensionCorrect,
            pilotDict.taskShareProfile.comprehensionWrong1,
            pilotDict.taskShareProfile.comprehensionWrong2,
          ]}
          correctAnswer={pilotDict.taskShareProfile.comprehensionCorrect}
          showVoice={isAudio}
          nextLabel={pilotDict.common.next}
          onAnswer={handleComprehension2}
        />
      )}

      {step === "sus" && <SusSurvey pilotDict={pilotDict} locale={locale} onSubmit={handleSusSubmit} />}

      {step === "satisfaction" && (
        <SatisfactionRating pilotDict={pilotDict} onSubmit={handleSatisfactionSubmit} />
      )}
    </div>
  );
}
