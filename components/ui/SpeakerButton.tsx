"use client";

import { Volume2 } from "lucide-react";
import { speak, useSpeechSynthesisSupported } from "@/lib/voice/browser-speech";
import { useVoiceConfig } from "@/lib/voice/VoiceConfigContext";

interface SpeakerButtonProps {
  /** The text to read aloud -- for a form field this is usually "label. hint". */
  text: string;
  className?: string;
  size?: number;
}

export function SpeakerButton({ text, className, size = 20 }: SpeakerButtonProps) {
  const supported = useSpeechSynthesisSupported();
  const { lang, dict } = useVoiceConfig();

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => speak(text, lang)}
      aria-label={dict.common.readAloud}
      title={dict.common.readAloud}
      className={
        className ??
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-indigo-700 hover:bg-indigo-300/20"
      }
    >
      <Volume2 size={size} aria-hidden="true" />
    </button>
  );
}
