import type { ReactNode } from "react";
import { SpeakerButton } from "@/components/ui/SpeakerButton";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-ink-500/15 pt-6">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
        <SpeakerButton
          text={title}
          size={16}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
        />
      </div>
      {children}
    </section>
  );
}
