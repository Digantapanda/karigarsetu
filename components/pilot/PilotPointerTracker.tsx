"use client";

import { useEffect, useRef } from "react";
import { submitPilotPointerEventBatch } from "@/app/pilot/task-actions";

const MOVE_SAMPLE_MS = 200;
const SCROLL_SAMPLE_MS = 300;
const FLUSH_INTERVAL_MS = 5000;

type PointerEventRecord =
  | { type: "move"; x: number; y: number; t: number }
  | { type: "click"; x: number; y: number; t: number; target: string }
  | { type: "hover"; x: number; y: number; t: number; target: string; durationMs: number }
  | { type: "scroll"; y: number; t: number };

function describeTarget(el: EventTarget | null): string {
  if (!(el instanceof HTMLElement)) return "unknown";
  const tag = el.tagName.toLowerCase();
  const text = el.textContent?.trim().slice(0, 40) ?? "";
  const role = el.getAttribute("role") ?? "";
  return [tag, role, text].filter(Boolean).join(":");
}

/**
 * Mounted globally (see app/layout.tsx) whenever a pilot session is
 * active. Collects, client-side only:
 *  - move: throttled cursor/touch position samples
 *  - click: every click/tap, with a short description of the target
 *  - hover: dwell time on interactive elements (button/a/[role=button]),
 *    from pointerenter to pointerleave
 *  - scroll: throttled vertical scroll position
 *
 * Batches are flushed every 5s and on unmount. Best-effort: a batch still
 * buffered at the exact moment of a hard navigation/tab-close can be lost
 * -- this is a known limitation of using a Server Action rather than
 * navigator.sendBeacon (which can't invoke a Next.js Server Action
 * directly), acceptable for a research pilot's aggregate path analysis.
 */
export function PilotPointerTracker() {
  const bufferRef = useRef<PointerEventRecord[]>([]);
  const batchStartRef = useRef<number>(0);
  const lastMoveRef = useRef(0);
  const lastScrollRef = useRef(0);
  const hoverStartRef = useRef<Map<EventTarget, number>>(new Map());

  useEffect(() => {
    batchStartRef.current = Date.now();

    function flush() {
      if (bufferRef.current.length === 0) return;
      const events = bufferRef.current;
      const startedAt = new Date(batchStartRef.current).toISOString();
      const endedAt = new Date().toISOString();
      bufferRef.current = [];
      batchStartRef.current = Date.now();
      void submitPilotPointerEventBatch(events, startedAt, endedAt);
    }

    function handleMove(e: PointerEvent) {
      const now = Date.now();
      if (now - lastMoveRef.current < MOVE_SAMPLE_MS) return;
      lastMoveRef.current = now;
      bufferRef.current.push({ type: "move", x: e.clientX, y: e.clientY, t: now });
    }

    function handleClick(e: MouseEvent) {
      bufferRef.current.push({
        type: "click",
        x: e.clientX,
        y: e.clientY,
        t: Date.now(),
        target: describeTarget(e.target),
      });
    }

    function isInteractive(el: EventTarget | null): el is HTMLElement {
      if (!(el instanceof HTMLElement)) return false;
      return (
        el.tagName === "BUTTON" ||
        el.tagName === "A" ||
        el.getAttribute("role") === "button" ||
        el.tagName === "INPUT" ||
        el.tagName === "SELECT"
      );
    }

    function handlePointerOver(e: PointerEvent) {
      const el = (e.target as HTMLElement)?.closest?.("button, a, [role=button], input, select");
      if (el && isInteractive(el) && !hoverStartRef.current.has(el)) {
        hoverStartRef.current.set(el, Date.now());
      }
    }

    function handlePointerOut(e: PointerEvent) {
      const el = (e.target as HTMLElement)?.closest?.("button, a, [role=button], input, select");
      if (el && hoverStartRef.current.has(el)) {
        const start = hoverStartRef.current.get(el)!;
        hoverStartRef.current.delete(el);
        const duration = Date.now() - start;
        if (duration > 150) {
          // Ignore incidental brush-past hovers under ~150ms of noise.
          bufferRef.current.push({
            type: "hover",
            x: e.clientX,
            y: e.clientY,
            t: Date.now(),
            target: describeTarget(el),
            durationMs: duration,
          });
        }
      }
    }

    function handleScroll() {
      const now = Date.now();
      if (now - lastScrollRef.current < SCROLL_SAMPLE_MS) return;
      lastScrollRef.current = now;
      bufferRef.current.push({ type: "scroll", y: window.scrollY, t: now });
    }

    document.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const interval = setInterval(flush, FLUSH_INTERVAL_MS);

    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
      flush();
    };
  }, []);

  return null;
}
