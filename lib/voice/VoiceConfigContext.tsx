"use client";

import { createContext, useContext, type ReactNode } from "react";
import en from "@/locales/en.json";
import type { Dictionary } from "@/lib/i18n/config";

export interface VoiceConfig {
  /** BCP-47 code, e.g. "hi-IN" -- see lib/i18n/config.ts SPEECH_LOCALE. */
  lang: string;
  dict: Dictionary;
}

const VoiceConfigContext = createContext<VoiceConfig | null>(null);

export function VoiceConfigProvider({ lang, dict, children }: VoiceConfig & { children: ReactNode }) {
  return <VoiceConfigContext.Provider value={{ lang, dict }}>{children}</VoiceConfigContext.Provider>;
}

// Falls back to English if a voice-enabled component is used outside any
// VoiceConfigProvider, so it never silently breaks -- just defaults to
// English speech instead of the active locale.
export function useVoiceConfig(): VoiceConfig {
  return useContext(VoiceConfigContext) ?? { lang: "en-IN", dict: en as Dictionary };
}
