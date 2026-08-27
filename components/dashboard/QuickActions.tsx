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

function tiles(dict: Dictionary, profileSlug?: string): ActionTile[] {
  return [
    { label: dict.dashboardPage.editProfile, href: "/dashboard/profile", icon: UserPen },
    {
      label: dict.dashboardPage.viewMyProfile,
      href: profileSlug ? `/craftsman/${profileSlug}` : undefined,
      icon: ExternalLink,
    },
    {
      label: dict.dashboardPage.shareProfile,
      href: profileSlug ? `/craftsman/${profileSlug}` : undefined,
      icon: Share2,
    },
    {
      label: dict.dashboardPage.generateQr,
      href: profileSlug ? `/craftsman/${profileSlug}` : undefined,
      icon: QrCode,
    },
    { label: dict.dashboardPage.myProducts, href: "/dashboard/products", icon: Package },
    { label: dict.dashboardPage.catalogueSync, href: "/dashboard/catalogue-sync", icon: RefreshCw },
    { label: dict.dashboardPage.viewOrders, icon: ShoppingBag, comingSoon: true },
  ];
}

export function QuickActions({ profileSlug, dict }: { profileSlug?: string; dict: Dictionary }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tiles(dict, profileSlug).map((tile) => {
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
