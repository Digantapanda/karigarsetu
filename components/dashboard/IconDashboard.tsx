import Link from "next/link";
import { UserPen, ExternalLink, Share2, Package, RefreshCw, Award, ShoppingBag } from "lucide-react";
import type { ComponentType } from "react";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import type { Dictionary } from "@/lib/i18n/config";

interface IconTile {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

function tiles(dict: Dictionary, profileSlug: string, pilotMode: boolean): IconTile[] {
  const base: IconTile[] = [
    { label: dict.dashboardPage.editProfile, href: "/dashboard/profile", icon: UserPen },
    { label: dict.dashboardPage.myProducts, href: "/dashboard/products", icon: Package },
    { label: dict.profileEditPage.awardsSection, href: "/dashboard/profile", icon: Award },
    { label: dict.dashboardPage.catalogueSync, href: "/dashboard/catalogue-sync", icon: RefreshCw },
  ];

  // Share Profile is hidden during an active pilot session, same as the
  // Text Mode dashboard -- see QuickActions.tsx for why.
  if (!pilotMode) {
    base.push({ label: dict.dashboardPage.shareProfile, href: `/craftsman/${profileSlug}`, icon: Share2 });
  }
  base.push({ label: dict.dashboardPage.viewMyProfile, href: `/craftsman/${profileSlug}`, icon: ExternalLink });

  if (pilotMode) {
    base.push({ label: dict.dashboardPage.viewOrders, href: "/dashboard/orders", icon: ShoppingBag });
  }

  return base;
}

/**
 * The Icon Mode dashboard from architecture doc §18: large icons, one word
 * of text per action, big touch targets, minimal reading required. Each
 * tile also carries its own speaker (from the voice layer built earlier)
 * so a person who can't read can tap to hear what each icon does before
 * committing to tap it -- Icon Mode and Voice Mode reinforcing each other
 * rather than being separate, competing choices.
 */
export function IconDashboard({
  profileSlug,
  completionPercent,
  dict,
  pilotMode = false,
}: {
  profileSlug: string;
  completionPercent: number;
  dict: Dictionary;
  pilotMode?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      {!pilotMode && (
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-ink-500)" strokeOpacity="0.15" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--color-turmeric-500)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - completionPercent / 100)}
            />
          </svg>
          <span className="absolute font-display text-2xl font-semibold text-ink-900">{completionPercent}%</span>
        </div>
      )}

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
        {tiles(dict, profileSlug, pilotMode).map((tile) => {
          const Icon = tile.icon;
          return (
            <div key={tile.label} className="relative">
              <Link
                href={tile.href}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-ink-500/15 bg-khadi-50 px-3 py-8 text-center transition-colors hover:border-indigo-500 active:bg-indigo-300/10"
              >
                <Icon size={40} className="text-indigo-700" />
                <span className="text-base font-semibold text-ink-900">{tile.label}</span>
              </Link>
              <div className="absolute right-2 top-2">
                <SpeakerButton
                  text={tile.label}
                  size={16}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-khadi-100 text-indigo-700 hover:bg-indigo-300/20"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
