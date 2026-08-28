"use client";

import { Volume2 } from "lucide-react";
import { speak, useSpeechSynthesisSupported } from "@/lib/voice/browser-speech";

interface SpeakerButtonProps {
  text: string;
  lang: string;
  label: string;
}

export function SpeakerButton({ text, lang, label }: SpeakerButtonProps) {
  const supported = useSpeechSynthesisSupported();
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => speak(text, lang)}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-indigo-700 hover:bg-indigo-300/20"
    >
      <Volume2 size={20} aria-hidden="true" />
    </button>
  );
}
