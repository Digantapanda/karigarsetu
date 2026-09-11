"use client";

import { UserPen, ShoppingBag, Share2, Settings } from "lucide-react";
import type { ComponentType } from "react";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { HelpButton } from "@/components/pilot/HelpButton";
import type { PilotCondition } from "@/lib/pilot/config";
import type { PilotDictionary } from "@/lib/pilot/dictionary";

interface TaskShareProfileProps {
  condition: PilotCondition;
  sessionId: string;
  pilotDict: PilotDictionary;
  onError: () => void;
  onDone: () => void;
}

export function TaskShareProfile({ condition, sessionId, pilotDict, onError, onDone }: TaskShareProfileProps) {
  const isAudio = condition === "TA" || condition === "TAI";
  const isIcon = condition === "TAI";
  const t = pilotDict.taskShareProfile;

  const buttons: { key: string; label: string; icon: ComponentType<{ size?: number; className?: string }>; correct: boolean }[] = [
    { key: "edit", label: t.buttonEditProfile, icon: UserPen, correct: false },
    { key: "orders", label: t.buttonViewOrders, icon: ShoppingBag, correct: false },
    { key: "share", label: t.buttonShareProfile, icon: Share2, correct: true },
    { key: "settings", label: t.buttonSettings, icon: Settings, correct: false },
  ];

  function handleTap(correct: boolean) {
    if (correct) {
      onDone();
    } else {
      onError();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <p className="text-lg font-medium text-ink-900">{t.instruction}</p>
        {isAudio && <SpeakerButton text={t.instruction} />}
      </div>

      <div className={isIcon ? "grid grid-cols-2 gap-4" : "flex flex-col gap-3"}>
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return isIcon ? (
            <div key={btn.key} className="relative">
              <button
                type="button"
                onClick={() => handleTap(btn.correct)}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-ink-500/15 bg-khadi-50 px-3 py-8 text-center hover:border-indigo-500 active:bg-indigo-300/10"
              >
                <Icon size={40} className="text-indigo-700" />
                <span className="text-base font-semibold text-ink-900">{btn.label}</span>
              </button>
              <div className="absolute right-2 top-2">
                <SpeakerButton
                  text={btn.label}
                  size={16}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-khadi-100 text-indigo-700 hover:bg-indigo-300/20"
                />
              </div>
            </div>
          ) : (
            <div key={btn.key} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleTap(btn.correct)}
                className="h-12 flex-1 rounded-lg border border-ink-500/20 bg-khadi-50 px-4 text-left text-base font-medium text-ink-900 hover:border-indigo-500"
              >
                {btn.label}
              </button>
              {isAudio && <SpeakerButton text={btn.label} />}
            </div>
          );
        })}
      </div>

      <HelpButton sessionId={sessionId} taskKey="share_profile" pilotDict={pilotDict} />
    </div>
  );
}
