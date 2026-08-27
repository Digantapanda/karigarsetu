import type { CraftCategory } from "@/types/domain";
import type { Dictionary } from "@/lib/i18n/config";

// Matches the category list in the architecture doc, §12.
// In production this is read from the `craft_categories` table (seeded via
// supabase/seed.sql); kept as a static list here too so the registration
// form has zero-latency options even before that migration is wired up.
export const CRAFT_CATEGORIES: CraftCategory[] = [
  { id: "handloom", name: "Handloom", slug: "handloom" },
  { id: "pottery", name: "Pottery", slug: "pottery" },
  { id: "dokra", name: "Dokra", slug: "dokra" },
  { id: "wood-craft", name: "Wood Craft", slug: "wood-craft" },
  { id: "bamboo-craft", name: "Bamboo Craft", slug: "bamboo-craft" },
  { id: "metal-craft", name: "Metal Craft", slug: "metal-craft" },
  { id: "textile", name: "Textile", slug: "textile" },
  { id: "embroidery", name: "Embroidery", slug: "embroidery" },
  { id: "jewellery", name: "Jewellery", slug: "jewellery" },
  { id: "painting", name: "Painting", slug: "painting" },
  { id: "leather-craft", name: "Leather Craft", slug: "leather-craft" },
  { id: "stone-craft", name: "Stone Craft", slug: "stone-craft" },
  { id: "terracotta", name: "Terracotta", slug: "terracotta" },
  { id: "cane-craft", name: "Cane Craft", slug: "cane-craft" },
  { id: "other", name: "Other", slug: "other" },
];

/**
 * Category *ids* stay canonical English (they're stored in the database
 * and used for filtering/matching) -- only the display label shown to the
 * person changes with the selected language. Use this wherever a category
 * name renders on screen; use CRAFT_CATEGORIES directly only when you need
 * the id/slug itself.
 */
export function translatedCraftCategoryOptions(dict: Dictionary): { value: string; label: string }[] {
  return CRAFT_CATEGORIES.map((c) => ({
    value: c.id,
    label: dict.craftCategories[c.id as keyof Dictionary["craftCategories"]] ?? c.name,
  }));
}

export function translatedCraftCategoryName(id: string | undefined, dict: Dictionary): string | undefined {
  if (!id) return undefined;
  return dict.craftCategories[id as keyof Dictionary["craftCategories"]];
}
