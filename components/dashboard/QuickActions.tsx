import Link from "next/link";
import { UserPen, ExternalLink, Share2, QrCode, Package, ShoppingBag, RefreshCw } from "lucide-react";
import type { ComponentType } from "react";
import type { Dictionary } from "@/lib/i18n/config";

interface ActionTile {
  label: string;
  href?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  comingSoon?: boolean;
}

function tiles(dict: Dictionary, profileSlug: string | undefined, pilotMode: boolean): ActionTile[] {
  const base: ActionTile[] = [
    { label: dict.dashboardPage.editProfile, href: "/dashboard/profile", icon: UserPen },
    {
      label: dict.dashboardPage.viewMyProfile,
      href: profileSlug ? `/craftsman/${profileSlug}` : undefined,
      icon: ExternalLink,
    },
  ];

  // Share Profile and Generate QR are hidden during an active pilot
  // session -- Task 4 in the study design specifically asks participants
  // to locate orders, and these two tiles aren't part of any pilot task.
  if (!pilotMode) {
    base.push(
      {
        label: dict.dashboardPage.shareProfile,
        href: profileSlug ? `/craftsman/${profileSlug}` : undefined,
        icon: Share2,
      },
      {
        label: dict.dashboardPage.generateQr,
        href: profileSlug ? `/craftsman/${profileSlug}` : undefined,
        icon: QrCode,
      }
    );
  }

  base.push(
    { label: dict.dashboardPage.myProducts, href: "/dashboard/products", icon: Package },
    { label: dict.dashboardPage.catalogueSync, href: "/dashboard/catalogue-sync", icon: RefreshCw }
  );

  // View Orders is a real, clickable tile only during a pilot session
  // (pointing at the mock Orders screen); for real craftsmen it stays a
  // disabled "coming soon" tile, since Orders isn't an actual feature yet.
  base.push(
    pilotMode
      ? { label: dict.dashboardPage.viewOrders, href: "/dashboard/orders", icon: ShoppingBag }
      : { label: dict.dashboardPage.viewOrders, icon: ShoppingBag, comingSoon: true }
  );

  return base;
}

export function QuickActions({
  profileSlug,
  dict,
  pilotMode = false,
}: {
  profileSlug?: string;
  dict: Dictionary;
  pilotMode?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tiles(dict, profileSlug, pilotMode).map((tile) => {
        const Icon = tile.icon;
        const disabled = tile.comingSoon || !tile.href;
        const content = (
          <>
            <Icon size={26} className="text-indigo-700" />
            <span className="text-sm font-medium text-ink-900">{tile.label}</span>
            {tile.comingSoon && <span className="text-xs text-ink-500">{dict.dashboardPage.comingSoon}</span>}
          </>
        );

        const className =
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-ink-500/15 bg-khadi-50 px-3 py-5 text-center transition-colors hover:border-indigo-500";

        return disabled ? (
          <div key={tile.label} className={`${className} opacity-50`} aria-disabled="true">
            {content}
          </div>
        ) : (
          <Link key={tile.label} href={tile.href!} className={className}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
