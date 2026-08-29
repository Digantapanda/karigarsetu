"use client";

import { useRef, useState } from "react";
import { Mic } from "lucide-react";
import { createSpeechRecognizer, useSpeechRecognitionSupported } from "@/lib/voice/browser-speech";
import { useVoiceConfig } from "@/lib/voice/VoiceConfigContext";

interface MicButtonProps {
  onResult: (transcript: string) => void;
  className?: string;
}

export function MicButton({ onResult, className }: MicButtonProps) {
  const supported = useSpeechRecognitionSupported();
  const { lang, dict } = useVoiceConfig();
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognizerRef = useRef<SpeechRecognitionLike | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!supported) return null;

  function showError(message: string) {
    setError(message);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => setError(null), 5000);
  }

  // Maps the Web Speech API's error codes to a specific, translated,
  // actionable message instead of the previous behavior of just silently
  // stopping -- this is what was making language-specific failures (like
  // Bengali recognition erroring out) look like "nothing happened."
  function messageForError(code: string): string {
    switch (code) {
      case "not-allowed":
      case "service-not-allowed":
        return dict.common.micPermissionDenied;
      case "language-not-supported":
        return dict.common.micLanguageNotSupported;
      case "network":
        return dict.common.micNetworkError;
      case "no-speech":
        return dict.common.micNoSpeech;
      default:
        return dict.common.voiceNotUnderstood;
    }
  }

  function handleClick() {
    setError(null);
    if (listening) {
      recognizerRef.current?.stop();
      return;
    }

    const recognizer = createSpeechRecognizer(lang);
    if (!recognizer) return;

    recognizer.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      } else {
        showError(dict.common.voiceNotUnderstood);
      }
    };
    recognizer.onerror = (event) => {
      setListening(false);
      showError(messageForError(event.error));
    };
    recognizer.onend = () => setListening(false);

    recognizerRef.current = recognizer;
    setListening(true);
    recognizer.start();
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={handleClick}
        aria-label={listening ? dict.common.listening : dict.common.tapToSpeak}
        title={listening ? dict.common.listening : dict.common.tapToSpeak}
        className={
          className ??
          [
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
            listening ? "animate-pulse bg-turmeric-100 text-turmeric-600" : "text-indigo-700 hover:bg-indigo-300/20",
          ].join(" ")
        }
      >
        <Mic size={20} aria-hidden="true" />
      </button>
      {error && (
        <span
          role="alert"
          className="absolute left-1/2 top-full z-10 mt-1 w-48 -translate-x-1/2 rounded-lg bg-red-50 p-2 text-xs text-red-700 shadow-lg"
        >
          {error}
        </span>
      )}
    </span>
  );
}
