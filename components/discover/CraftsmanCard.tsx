import Link from "next/link";
import type { CraftsmanSearchResult } from "@/lib/domain/craftsman";
import { translatedCraftCategoryName } from "@/lib/domain/craft-categories";
import { format } from "@/lib/i18n/dictionaries";
import type { Dictionary } from "@/lib/i18n/config";

export function CraftsmanCard({ craftsman, dict }: { craftsman: CraftsmanSearchResult; dict: Dictionary }) {
  const location = [craftsman.villageTown, craftsman.district, craftsman.state]
    .filter(Boolean)
    .join(", ");
  const craftName = translatedCraftCategoryName(craftsman.primaryCraftCategory?.id, dict);

  return (
    <Link
      href={`/craftsman/${craftsman.slug}`}
      className="flex gap-4 rounded-xl border border-ink-500/15 bg-khadi-50 p-4 transition-colors hover:border-indigo-500"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-turmeric-500 bg-khadi-100">
        {craftsman.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={craftsman.photoUrl} alt={craftsman.craftsmanName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-xl text-ink-500">
            {craftsman.craftsmanName.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-display text-lg font-semibold text-ink-900">
            {craftsman.craftsmanName}
          </p>
          {craftsman.verificationStatus === "verified" && (
            <span className="shrink-0 rounded-full bg-loom-600 px-2 py-0.5 text-[10px] font-semibold text-khadi-50">
              {dict.discoverPage.verifiedBadge}
            </span>
          )}
          {craftsman.hasGiTag && (
            <span className="shrink-0 rounded-full bg-turmeric-500 px-2 py-0.5 text-[10px] font-semibold text-khadi-50">
              {dict.discoverPage.giTaggedBadge}
            </span>
          )}
        </div>
        <p className="truncate text-sm text-ink-700">
          {craftName ?? "Craftsman"}
          {location ? ` · ${location}` : ""}
        </p>
        {craftsman.yearsOfExperience ? (
          <p className="text-sm text-ink-500">
            {format(dict.discoverPage.yearsOfExperience, { n: craftsman.yearsOfExperience })}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
