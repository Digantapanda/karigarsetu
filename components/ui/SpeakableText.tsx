import type { ElementType, ReactNode } from "react";
import { SpeakerButton } from "@/components/ui/SpeakerButton";

interface SpeakableTextProps {
  /** Plain text to be read aloud -- keep this the same as the visible text. */
  text: string;
  className?: string;
  /** The element to render the text in, e.g. "p" or "span". Defaults to "p". */
  as?: ElementType;
  children?: ReactNode;
}

/**
 * For instructional paragraphs, notices, and hints that aren't attached to
 * a form field (so Field's built-in voice controls don't cover them) --
 * e.g. a registration subheading, a privacy notice, a "why this matters"
 * blurb. Must be rendered inside a VoiceConfigProvider to pick up the
 * current language; falls back to English otherwise (see
 * lib/voice/VoiceConfigContext.tsx).
 */
export function SpeakableText({ text, className, as: Tag = "p", children }: SpeakableTextProps) {
  return (
    <div className="flex items-start gap-2">
      <Tag className={className}>{children ?? text}</Tag>
      <SpeakerButton
        text={text}
        size={16}
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
      />
    </div>
  );
}
