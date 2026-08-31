import type { ProfileCompletion } from "@/lib/domain/profile-completion";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { SpeakableText } from "@/components/ui/SpeakableText";

export function ProfileCompletionCard({
  completion,
  title = "Profile completion",
}: {
  completion: ProfileCompletion;
  title?: string;
}) {
  const nextHint = completion.items.find((i) => !i.done)?.hint;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
          <SpeakerButton
            text={title}
            size={16}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
          />
        </div>
        <span className="font-display text-2xl font-semibold text-indigo-700">{completion.percent}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-500/10" role="progressbar" aria-valuenow={completion.percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-turmeric-500 transition-all" style={{ width: `${completion.percent}%` }} />
      </div>

      <ul className="flex flex-col gap-1.5">
        {completion.items.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className={
                item.done
                  ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-loom-600 text-[10px] text-khadi-50"
                  : "h-5 w-5 shrink-0 rounded-full border-2 border-ink-500/30"
              }
            >
              {item.done ? "✓" : ""}
            </span>
            <span className={item.done ? "text-ink-700" : "text-ink-500"}>{item.label}</span>
            {!item.done && (
              <SpeakerButton
                text={item.hint ? `${item.label}. ${item.hint}` : item.label}
                size={14}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
              />
            )}
          </li>
        ))}
      </ul>

      {nextHint && <SpeakableText text={nextHint} className="text-sm text-ink-500" />}
    </div>
  );
}
