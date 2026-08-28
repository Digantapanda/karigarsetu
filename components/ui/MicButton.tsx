"use client";

import { useRef, useState } from "react";
import { Mic } from "lucide-react";
import { createSpeechRecognizer, useSpeechRecognitionSupported } from "@/lib/voice/browser-speech";

interface MicButtonProps {
  lang: string;
  label: string;
  listeningLabel: string;
  onResult: (transcript: string) => void;
}

export function MicButton({ lang, label, listeningLabel, onResult }: MicButtonProps) {
  const [listening, setListening] = useState(false);
  const supported = useSpeechRecognitionSupported();
  const recognizerRef = useRef<SpeechRecognitionLike | null>(null);

  if (!supported) return null;

  function handleClick() {
    if (listening) {
      recognizerRef.current?.stop();
      return;
    }

    const recognizer = createSpeechRecognizer(lang);
    if (!recognizer) return;

    recognizer.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };
    recognizer.onerror = () => setListening(false);
    recognizer.onend = () => setListening(false);

    recognizerRef.current = recognizer;
    setListening(true);
    recognizer.start();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={listening ? listeningLabel : label}
      title={listening ? listeningLabel : label}
      className={[
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
        listening ? "animate-pulse bg-turmeric-100 text-turmeric-600" : "text-indigo-700 hover:bg-indigo-300/20",
      ].join(" ")}
    >
      <Mic size={20} aria-hidden="true" />
    </button>
  );
}
