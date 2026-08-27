interface StepIndicatorProps {
  steps: string[];
  currentStep: number; // 0-indexed
  ariaLabel?: string;
}

export function StepIndicator({ steps, currentStep, ariaLabel = "Registration progress" }: StepIndicatorProps) {
  return (
    <ol className="flex items-start" aria-label={ariaLabel}>
      {steps.map((label, i) => {
        const state = i < currentStep ? "done" : i === currentStep ? "current" : "upcoming";
        const isLast = i === steps.length - 1;
        return (
          <li key={label} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <span
                aria-current={state === "current" ? "step" : undefined}
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  state === "done" && "border-turmeric-500 bg-turmeric-500 text-khadi-50",
                  state === "current" && "border-indigo-700 bg-indigo-700 text-khadi-50",
                  state === "upcoming" && "border-ink-500/30 bg-khadi-50 text-ink-500",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={[
                    "mx-1 h-[3px] flex-1 rounded-full",
                    state === "done" ? "bg-turmeric-500" : "bg-ink-500/20",
                  ].join(" ")}
                  style={
                    state !== "done"
                      ? {
                          backgroundImage:
                            "repeating-linear-gradient(90deg, var(--color-ink-500) 0 6px, transparent 6px 12px)",
                          backgroundColor: "transparent",
                          opacity: 0.35,
                        }
                      : undefined
                  }
                />
              )}
            </div>
            <span
              className={[
                "mt-2 hidden text-center text-xs leading-tight sm:block",
                state === "current" ? "font-semibold text-ink-900" : "text-ink-500",
              ].join(" ")}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
