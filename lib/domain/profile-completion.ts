import type { CraftsmanProfileWithRelations } from "@/types/domain";
import type { Dictionary } from "@/lib/i18n/config";

export interface CompletionItem {
  key: string;
  label: string;
  done: boolean;
  hint?: string;
}

export interface ProfileCompletion {
  percent: number;
  items: CompletionItem[];
}

/**
 * Mirrors the checklist in the architecture doc's §15 (Profile Completion).
 * "Add products" is intentionally left out for now -- the products table
 * doesn't exist until Phase 5, so this list only checks fields that are
 * actually persisted today. It's designed to grow, not be exhaustive.
 */
export function getProfileCompletion(
  profile: CraftsmanProfileWithRelations,
  dict: Dictionary
): ProfileCompletion {
  const d = dict.dashboardPage;
  const items: CompletionItem[] = [
    {
      key: "basic",
      label: d.completionBasic,
      done: Boolean(profile.craftsmanName && profile.villageTown && profile.district && profile.state),
    },
    {
      key: "contact",
      label: d.completionContact,
      done: Boolean(profile.shopContactNumber),
      hint: d.completionContactHint,
    },
    {
      key: "craft",
      label: d.completionCraft,
      done: Boolean(profile.description),
      hint: d.completionCraftHint,
    },
    {
      key: "photo",
      label: d.completionPhoto,
      done: Boolean(profile.photoUrl),
      hint: d.completionPhotoHint,
    },
    {
      key: "recognition",
      label: d.completionRecognition,
      done: profile.awards.length > 0 || profile.giTags.length > 0,
      hint: d.completionRecognitionHint,
    },
  ];

  const percent = Math.round((items.filter((i) => i.done).length / items.length) * 100);
  return { percent, items };
}
