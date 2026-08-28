"use client";

import { useSyncExternalStore } from "react";

/**
 * Thin wrappers around the browser's Web Speech API (SpeechSynthesis for
 * "speaker" playback, SpeechRecognition for microphone input). Zero cost,
 * no API keys, works entirely in-browser -- matches the architecture doc's
 * Voice Mode constraint (§2, §19) of using Web Speech API wherever
 * possible rather than a paid speech service.
 *
 * Both the recognizer and the synthesized voice take a BCP-47 language
 * code (see lib/i18n/config.ts SPEECH_LOCALE) so voice input/output always
 * matches whichever of English/Hindi/Bengali is currently selected --
 * this is deliberately NOT hardcoded to English.
 *
 * Support varies by browser (notably inconsistent on iOS Safari) --
 * callers should check isSpeechRecognitionSupported() /
 * isSpeechSynthesisSupported() and simply not render the control when
 * unsupported, rather than showing a broken button.
 */

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

/**
 * Creates a ready-to-use, single-utterance speech recognizer in the given
 * language, or null if the browser doesn't support the API. Deliberately
 * non-continuous with a single alternative -- this is meant for "speak one
 * field, get one transcript," not open-ended dictation.
 */
export function createSpeechRecognizer(lang: string): SpeechRecognitionLike | null {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) return null;
  const recognizer = new Ctor();
  recognizer.lang = lang;
  recognizer.interimResults = false;
  recognizer.continuous = false;
  recognizer.maxAlternatives = 1;
  return recognizer;
}

/** Reads text aloud in the given language. Cancels any speech already in progress first. */
export function speak(text: string, lang: string) {
  if (!isSpeechSynthesisSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

// --- Client-only support detection, safe for SSR ---
//
// `window` doesn't exist during server rendering, so checking support
// directly in a component body would make the server render one thing and
// the client render another in the same spot -- a hydration mismatch.
// useSyncExternalStore is the React-recommended way to read this kind of
// external, unchanging browser capability: its server snapshot is used
// for the first render (so it matches SSR), and it re-reads the real
// value once mounted in the browser, without the "setState inside an
// effect" pattern the lint rules flag.
const noopSubscribe = () => () => {};

export function useSpeechSynthesisSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, isSpeechSynthesisSupported, () => false);
}

export function useSpeechRecognitionSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, isSpeechRecognitionSupported, () => false);
}
