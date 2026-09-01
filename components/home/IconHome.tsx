import Link from "next/link";
import { UserPlus, Search, LogIn } from "lucide-react";
import type { ComponentType } from "react";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import type { Dictionary } from "@/lib/i18n/config";

interface IconCard {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export function IconHome({ dict }: { dict: Dictionary }) {
  const cards: IconCard[] = [
    { label: dict.home.ctaRegister, href: "/register", icon: UserPlus },
    { label: dict.home.ctaDiscover, href: "/discover", icon: Search },
    { label: dict.home.ctaLogin, href: "/login", icon: LogIn },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="relative">
            <Link
              href={card.href}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-ink-500/15 bg-khadi-50 px-4 py-10 text-center transition-colors hover:border-indigo-500 active:bg-indigo-300/10"
            >
              <Icon size={48} className="text-indigo-700" />
              <span className="text-lg font-semibold text-ink-900">{card.label}</span>
            </Link>
            <div className="absolute right-2 top-2">
              <SpeakerButton
                text={card.label}
                size={16}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-khadi-100 text-indigo-700 hover:bg-indigo-300/20"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
