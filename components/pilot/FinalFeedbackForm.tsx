"use client";

import { useTransition } from "react";
import { submitFinalFeedbackAction } from "@/app/pilot/actions";
import type { PilotDictionary } from "@/lib/pilot/dictionary";
import type { PilotCondition } from "@/lib/pilot/config";

export function FinalFeedbackForm({
  participantId,
  participantCode,
  sequence,
  pilotDict,
}: {
  participantId: string;
  participantCode: string;
  sequence: PilotCondition[];
  pilotDict: PilotDictionary;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const preferred = formData.get("preferred") as PilotCondition;
    const comments = String(formData.get("comments") ?? "");
    startTransition(async () => {
      await submitFinalFeedbackAction(participantId, participantCode, preferred, comments);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-lg font-medium text-ink-900">{pilotDict.finalFeedback.preferQuestion}</legend>
        {sequence.map((condition, i) => (
          <label key={condition} className="flex items-center gap-3 rounded-lg border-2 border-ink-500/20 bg-khadi-50 px-4 py-3">
            <input type="radio" name="preferred" value={condition} required className="h-5 w-5 accent-indigo-700" />
            <span className="text-base font-medium text-ink-900">
              {pilotDict.common.version} {i + 1}
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="comments" className="text-sm font-medium text-ink-900">
          {pilotDict.finalFeedback.commentsLabel}
        </label>
        <textarea
          id="comments"
          name="comments"
          rows={3}
          className="w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 py-3 text-base text-ink-900 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-12 self-start rounded-lg bg-indigo-700 px-8 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-60"
      >
        {pilotDict.finalFeedback.submit}
      </button>
    </form>
  );
}
