"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { submitAddGiTag, submitDeleteGiTag } from "@/app/dashboard/profile/actions";
import type { GITag } from "@/types/domain";
import type { Dictionary } from "@/lib/i18n/config";

export function GiTagManager({ giTags, dict }: { giTags: GITag[]; dict: Dictionary }) {
  const f = dict.fields;
  const p = dict.profileEditPage;
  const [isPending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      await submitAddGiTag(formData);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await submitDeleteGiTag(id);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {giTags.length > 0 && (
        <ul className="flex flex-col gap-2">
          {giTags.map((gi) => (
            <li key={gi.id} className="flex items-center justify-between gap-3 rounded-lg bg-khadi-50 p-3">
              <div>
                <p className="text-sm font-medium text-ink-900">{gi.giTagName}</p>
                <p className="text-xs text-ink-500">
                  {gi.verificationStatus !== "verified" ? p.awaitingVerification : p.verified}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(gi.id)}
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
        <Field label={f.giTagName} name="giTagName" required />
        <Field label={p.referenceNumber} name="referenceNumber" />
        <Button type="submit" variant="secondary" disabled={isPending} className="self-start">
          {p.addGiTag}
        </Button>
      </form>
    </div>
  );
}
