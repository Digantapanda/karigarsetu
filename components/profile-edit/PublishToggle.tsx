"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { togglePublish } from "@/app/dashboard/profile/actions";
import type { ProfileStatus } from "@/types/domain";
import type { Dictionary } from "@/lib/i18n/config";

export function PublishToggle({ status, dict }: { status: ProfileStatus; dict: Dictionary }) {
  const p = dict.profileEditPage;
  const [isPending, startTransition] = useTransition();
  const isPublished = status === "published";
  const title = isPublished ? p.publishedTitle : p.draftTitle;
  const body = isPublished ? p.publishedBody : p.draftBody;

  function handleClick() {
    startTransition(async () => {
      await togglePublish(!isPublished);
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">{title}</p>
          <p className="text-sm text-ink-500">{body}</p>
        </div>
        <SpeakerButton
          text={`${title}. ${body}`}
          size={16}
          className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
        />
      </div>
      <Button onClick={handleClick} disabled={isPending} variant={isPublished ? "secondary" : "primary"}>
        {isPending ? p.updating : isPublished ? p.unpublish : p.publish}
      </Button>
    </div>
  );
}
