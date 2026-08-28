"use client";

import { useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { MicButton } from "@/components/ui/MicButton";
import { useVoiceConfig } from "@/lib/voice/VoiceConfigContext";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  trailing?: ReactNode;
  /** Opt-in: shows a speaker (read aloud) and microphone (speak to fill) icon, in the current language. */
  voice?: boolean;
}

export function Field({
  label,
  hint,
  error,
  required,
  trailing,
  id,
  voice,
  ...inputProps
}: FieldProps) {
  const fieldId = id ?? inputProps.name;
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceConfig = useVoiceConfig();

  // Never offer voice fill/read on password fields.
  const showVoice = voice && inputProps.type !== "password";

  function handleVoiceResult(transcript: string) {
    const input = inputRef.current;
    if (!input) return;
    // Setting .value directly on a React-controlled input doesn't trigger
    // its onChange -- dispatching a native "input" event after using the
    // native value setter does, because React listens for that event at
    // the root. This lets voice input flow through the exact same
    // controlled onChange every other keystroke uses.
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    nativeSetter?.call(input, transcript);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

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
        <input
          id={fieldId}
          ref={inputRef}
          {...inputProps}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 placeholder:text-ink-500/60 focus:border-indigo-500"
        />
        {showVoice && (
          <>
            <SpeakerButton
              text={hint ? `${label}. ${hint}` : label}
              lang={voiceConfig.lang}
              label={voiceConfig.labels.readAloud}
            />
            <MicButton
              lang={voiceConfig.lang}
              label={voiceConfig.labels.tapToSpeak}
              listeningLabel={voiceConfig.labels.listening}
              onResult={handleVoiceResult}
            />
          </>
        )}
        {trailing}
      </div>
      {error ? (
        <p id={`${fieldId}-error`} className="text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-sm text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
