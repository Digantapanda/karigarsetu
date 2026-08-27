import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-ink-500/15 pt-6">
      <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}
