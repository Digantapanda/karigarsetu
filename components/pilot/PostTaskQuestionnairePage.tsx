"use client";

import { useTransition } from "react";
import { submitPostTaskBatteryAction } from "@/app/pilot/actions";
import { PostTaskQuestionnaire } from "@/components/pilot/PostTaskQuestionnaire";
import type { PilotDictionary } from "@/lib/pilot/dictionary";
import type { PilotCondition } from "@/lib/pilot/config";
import type { Locale } from "@/lib/i18n/config";
import type { PostTaskBatteryInput } from "@/lib/domain/pilot";

interface Props {
  sessionId: string;
  participantId: string;
  participantCode: string;
  condition: PilotCondition;
  orderPosition: number;
  locale: Locale;
  pilotDict: PilotDictionary;
}

export function PostTaskQuestionnairePage({
  sessionId,
  participantId,
  participantCode,
  condition,
  orderPosition,
  locale,
  pilotDict,
}: Props) {
  const [, startTransition] = useTransition();

  function handleSubmit(battery: PostTaskBatteryInput) {
    startTransition(async () => {
      await submitPostTaskBatteryAction(participantCode, participantId, sessionId, orderPosition, battery);
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-10">
      <p className="text-center text-sm font-medium text-ink-500">
        {pilotDict.common.version} {orderPosition} {pilotDict.common.of3}
      </p>
      <PostTaskQuestionnaire condition={condition} locale={locale} pilotDict={pilotDict} onSubmit={handleSubmit} />
    </div>
  );
}
