"use client";

import { useRef, type SelectHTMLAttributes } from "react";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { MicButton } from "@/components/ui/MicButton";
import { useVoiceConfig } from "@/lib/voice/VoiceConfigContext";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  /** Opt-in: speaker reads the label and every option aloud; microphone lets the person speak an option to select it. */
  voice?: boolean;
}

// Loose match so spoken language doesn't need to be a perfect transcript:
// case-insensitive (meaningless for Hindi/Bengali script but harmless),
// whitespace-normalized, and matches either direction as a substring so
// "handloom please" still matches the option "Handloom".
function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function findMatchingOption(transcript: string, options: Option[]): Option | undefined {
  const spoken = normalize(transcript);
  if (!spoken) return undefined;
  return (
    options.find((o) => normalize(o.label) === spoken) ??
    options.find((o) => spoken.includes(normalize(o.label))) ??
    options.find((o) => normalize(o.label).includes(spoken))
  );
}

export function SelectField({
  label,
  options,
  placeholder,
  error,
  required,
  id,
  voice,
  ...selectProps
}: SelectFieldProps) {
  const fieldId = id ?? selectProps.name;
  const selectRef = useRef<HTMLSelectElement>(null);
  const { dict } = useVoiceConfig();

  function handleVoiceResult(transcript: string) {
    const match = findMatchingOption(transcript, options);
    const select = selectRef.current;
    if (!match || !select) return;
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
    nativeSetter?.call(select, match.value);
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  const speakText = voice
    ? `${label}. ${dict.common.optionsAre} ${options.map((o) => o.label).join(", ")}`
    : "";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="flex items-baseline justify-between text-sm font-medium text-ink-900">
        <span>
          {label}
          {required ? (
            <span className="ml-1 text-turmeric-600" aria-hidden="true">*</span>
          ) : (
            <span className="ml-1.5 text-xs font-normal text-ink-500">(optional)</span>
          )}
        </span>
      </label>
      <div className="flex items-center gap-1">
        <select
          id={fieldId}
          ref={selectRef}
          {...selectProps}
          aria-required={required}
          aria-invalid={Boolean(error)}
          className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 focus:border-indigo-500"
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {voice && (
          <>
            <SpeakerButton text={speakText} />
            <MicButton onResult={handleVoiceResult} />
          </>
        )}
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
