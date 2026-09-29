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
 * Support varies by browser and by OS-installed voices (notably
 * inconsistent on iOS Safari, and language coverage for Hindi/Bengali
 * specifically depends on what's installed on the device) -- callers
 * should check isSpeechRecognitionSupported() / isSpeechSynthesisSupported()
 * and simply not render the control when the API itself is unsupported,
 * rather than showing a broken button. A supported API with no matching
 * language voice installed is a separate, device-level limitation this
 * code can't fully paper over -- see speak()'s fallback behavior below.
 */

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  if (isPilotVoiceForcedOff()) return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  if (isPilotVoiceForcedOff()) return false;
  return true;
}

/**
 * During an active pilot session in condition T (text-only, no audio),
 * voice controls must be completely absent, not just unused -- the study
 * is specifically comparing conditions with and without audio, so leaving
 * the speaker/mic available (even if the participant doesn't touch them)
 * would blur that comparison. lib/pilot/session-cookie.ts sets this flag
 * client-readable, synchronously checkable here without turning every
 * support check into an async cookie read.
 */
function isPilotVoiceForcedOff(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c === "pilot_voice_off=1");
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

// --- Voice list loading ---
//
// speechSynthesis.getVoices() very often returns an EMPTY array the first
// time it's called on a page -- the voice list loads asynchronously and
// only becomes available once the "voiceschanged" event fires. Calling
// .speak() before that has happened is a well-documented cause of
// "nothing happens" bugs in Chromium browsers, and it disproportionately
// affects non-English/non-default languages (Hindi, Bengali) because the
// browser prioritizes loading the system default voice first. This is the
// most likely root cause of Bengali speech silently doing nothing.
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSynthesisSupported()) return Promise.resolve([]);
  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    const handleVoicesChanged = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    // Some browsers never fire voiceschanged if voices were already
    // available synchronously by the time this runs -- fall back to a
    // short timeout so we don't hang forever waiting for an event that
    // isn't coming.
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });

  return voicesPromise;
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const exact = voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
  if (exact) return exact;
  const languageOnly = lang.split("-")[0].toLowerCase();
  return voices.find((v) => v.lang.toLowerCase().startsWith(languageOnly));
}

/**
 * Reads text aloud in the given language. Cancels any speech already in
 * progress first. Waits for the voice list to finish loading and
 * explicitly picks a matching voice when one exists, instead of relying
 * on utterance.lang alone -- fixes the common "first call does nothing"
 * bug and gives non-English languages a real shot at using a voice that
 * actually speaks that language, rather than silently falling back to
 * whatever the browser's default voice happens to be.
 *
 * Returns false if there's no voice at all for this language (device
 * limitation, not a code bug) so callers can surface that honestly.
 */
export async function speak(text: string, lang: string): Promise<boolean> {
  if (!isSpeechSynthesisSupported() || !text.trim()) return false;

  const voices = await loadVoices();
  const voice = pickVoice(voices, lang);

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);

  // If no voice on this device covers the requested language at all,
  // report that honestly rather than pretending it worked -- the browser
  // may still say nothing audible, or read it in a default-language voice.
  return Boolean(voice);
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
