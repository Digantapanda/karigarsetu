"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { SelectField } from "@/components/ui/SelectField";
import { submitAddAward, submitDeleteAward } from "@/app/dashboard/profile/actions";
import type { Award } from "@/types/domain";
import type { Dictionary } from "@/lib/i18n/config";

export function AwardsManager({ awards, dict }: { awards: Award[]; dict: Dictionary }) {
  const f = dict.fields;
  const p = dict.profileEditPage;
  const [isPending, startTransition] = useTransition();

  const levelLabel: Record<Award["level"], string> = {
    national: p.levelNational,
    state: p.levelState,
    other: p.levelOther,
  };
  const LEVEL_OPTIONS = [
    { value: "national", label: p.levelNational },
    { value: "state", label: p.levelState },
    { value: "other", label: p.levelOther },
  ];

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      await submitAddAward(formData);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await submitDeleteAward(id);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {awards.length > 0 && (
        <ul className="flex flex-col gap-2">
          {awards.map((award) => (
            <li
              key={award.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-khadi-50 p-3"
            >
              <div>
                <p className="text-sm font-medium text-ink-900">{award.name}</p>
                <p className="text-xs text-ink-500">
                  {levelLabel[award.level]} ·{" "}
                  {award.verificationStatus !== "verified" ? p.awaitingVerification : p.verified}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(award.id)}
                disabled={isPending}
                className="text-sm text-red-700 hover:underline"
              >
                {p.remove}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form action={handleAdd} className="flex flex-col gap-3 rounded-lg border border-ink-500/15 p-4">
        <Field label={f.awardName} name="name" required voice />
        <SelectField label={p.level} name="level" options={LEVEL_OPTIONS} defaultValue="other" voice />
        <Field label={p.year} name="year" type="number" inputMode="numeric" voice />
        <Field label={p.issuingOrganization} name="issuingOrganization" voice />
        <Button type="submit" variant="secondary" disabled={isPending} className="self-start">
          {p.addAward}
        </Button>
      </form>
    </div>
  );
}
