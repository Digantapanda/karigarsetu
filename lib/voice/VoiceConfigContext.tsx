"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface VoiceConfig {
  /** BCP-47 code, e.g. "hi-IN" -- see lib/i18n/config.ts SPEECH_LOCALE. */
  lang: string;
  labels: {
    readAloud: string;
    tapToSpeak: string;
    listening: string;
  };
}

const VoiceConfigContext = createContext<VoiceConfig | null>(null);

export function VoiceConfigProvider({
  lang,
  labels,
  children,
}: VoiceConfig & { children: ReactNode }) {
  return (
    <VoiceConfigContext.Provider value={{ lang, labels }}>{children}</VoiceConfigContext.Provider>
  );
}

// Falls back to English defaults if a Field is used with voice=true outside
// any VoiceConfigProvider, so it never silently breaks -- just defaults
// to English speech instead of the active locale.
export function useVoiceConfig(): VoiceConfig {
  return (
    useContext(VoiceConfigContext) ?? {
      lang: "en-IN",
      labels: {
        readAloud: "Read this field aloud",
        tapToSpeak: "Tap to fill this field by speaking",
        listening: "Listening…",
      },
    }
  );
}
