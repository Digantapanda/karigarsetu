import { VerificationBadge, GIBadge } from "@/components/profile/Badges";
import { translatedCraftCategoryName } from "@/lib/domain/craft-categories";
import type { CraftsmanProfileWithRelations } from "@/types/domain";
import type { Dictionary } from "@/lib/i18n/config";

export function ProfileHeader({ profile, dict }: { profile: CraftsmanProfileWithRelations; dict: Dictionary }) {
  const location = [profile.villageTown, profile.district, profile.state].filter(Boolean).join(", ");
  const craftName = translatedCraftCategoryName(profile.primaryCraftCategoryId, dict);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-turmeric-500 bg-khadi-100 sm:h-28 sm:w-28">
        {profile.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photoUrl} alt={profile.craftsmanName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl text-ink-500">
            {profile.craftsmanName.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          {profile.craftsmanName}
        </h1>
        <p className="text-ink-700">
          {craftName ?? "Craftsman"}
          {location ? ` · ${location}` : ""}
          {profile.yearsOfExperience ? ` · ${profile.yearsOfExperience} years of experience` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          {profile.verificationStatus === "verified" && <VerificationBadge />}
          {profile.giTags.map((gi) => (
            <GIBadge key={gi.id} label={gi.giTagName} />
          ))}
        </div>
      </div>
    </header>
  );
}
