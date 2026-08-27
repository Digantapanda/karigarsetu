import { createClient } from "@/lib/supabase/server";
import { registrationSchema } from "@/lib/validation/registration";
import { slugify, withDisambiguator } from "@/lib/utils/slug";
import { CRAFT_CATEGORIES } from "@/lib/domain/craft-categories";
import type {
  CraftsmanRegistrationInput,
  CraftsmanProfile,
  CraftsmanProfileWithRelations,
  Award,
  GITag,
  VerificationStatus,
  CraftCategory,
} from "@/types/domain";

export interface CreateCraftsmanProfileResult {
  success: boolean;
  profile?: CraftsmanProfile;
  /** Plain-language error, safe to show directly in any interface mode. */
  error?: string;
}

/**
 * The single entry point for completing craftsman registration.
 *
 * This is the shared domain-layer function described in the architecture
 * doc's "one domain layer, three adapters" principle: Text Mode calls it
 * once all five form steps are filled in, Icon Mode calls it after its
 * simplified wizard, and Voice Mode calls it after the spoken details are
 * confirmed back to the user. None of the interface layers talk to
 * Supabase directly.
 */
export async function createCraftsmanProfile(
  input: CraftsmanRegistrationInput
): Promise<CreateCraftsmanProfileResult> {
  // Server-side validation always runs, regardless of what the client already checked.
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Some details are missing or invalid. Please check the form and try again.",
    };
  }

  const { account, craftsmanInfo, businessInfo, craftInfo, recognition } = parsed.data;
  const supabase = await createClient();

  // 1. Create the auth user (email/password for MVP; phone OTP can be added
  // later without changing this domain function's signature -- see
  // architecture doc §4).
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: account.email,
    password: account.password,
    options: {
      data: { full_name: account.fullName, mobile_number: account.mobileNumber },
    },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error:
        authError?.message.includes("already registered")
          ? "An account with this email already exists. Please log in instead."
          : "We couldn't create your account. Please try again.",
    };
  }

  // 2. Generate a unique public-profile slug.
  const baseSlug = slugify(craftsmanInfo.craftsmanName);
  let slug = baseSlug;
  const { data: existing } = await supabase
    .from("craftsman_profiles")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) {
    slug = withDisambiguator(baseSlug);
  }

  // 3. Insert the profile row. GST and registration numbers default to
  // private -- the craftsman opts in to making them public later
  // (architecture doc §7, §39).
  const { data: profile, error: profileError } = await supabase
    .from("craftsman_profiles")
    .insert({
      user_id: authData.user.id,
      slug,
      craftsman_name: craftsmanInfo.craftsmanName,
      registration_number: craftsmanInfo.registrationNumber || null,
      registration_authority: craftsmanInfo.registrationAuthority || null,
      years_of_experience: craftsmanInfo.yearsOfExperience ?? null,
      shop_name: businessInfo.shopName || null,
      address: businessInfo.businessAddress || null,
      shop_contact_number: businessInfo.shopContactNumber || null,
      village_town: businessInfo.villageTown,
      district: businessInfo.district,
      state: businessInfo.state,
      pin_code: businessInfo.pinCode || null,
      gst_number: businessInfo.gstNumber || null,
      gst_public: false,
      registration_public: false,
      primary_craft_category_id: craftInfo.primaryCraftCategoryId,
      secondary_craft_category_id: craftInfo.secondaryCraftCategoryId || null,
      craft_tradition: craftInfo.craftTradition || null,
      description: craftInfo.craftDescription || null,
      geographic_region: craftInfo.geographicRegion || null,
      verification_status: "unverified",
      profile_status: "draft",
      interface_mode_preference: "text",
      locale_preference: "en",
    })
    .select()
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      error: "We saved your account, but couldn't create your profile. Please try again.",
    };
  }

  // 4. Recognition data (awards / GI tag) goes into their own tables so the
  // admin verification workflow (§16) can review each item independently.
  if (recognition.giTag && recognition.giTagName) {
    await supabase.from("gi_tags").insert({
      craftsman_id: profile.id,
      gi_tag_name: recognition.giTagName,
      reference_number: recognition.giReferenceNumber || null,
      verification_status: "unverified",
    });
  }

  const awardEntries = [
    recognition.nationalAward && { name: recognition.nationalAward, level: "national" as const },
    recognition.stateAward && { name: recognition.stateAward, level: "state" as const },
    recognition.otherRecognition && { name: recognition.otherRecognition, level: "other" as const },
  ].filter(Boolean) as { name: string; level: "national" | "state" | "other" }[];

  if (awardEntries.length > 0) {
    await supabase.from("awards").insert(
      awardEntries.map((a) => ({
        craftsman_id: profile.id,
        name: a.name,
        level: a.level,
        verification_status: "unverified",
      }))
    );
  }

  // 5. Log the interaction event for the Text vs Icon vs Voice research
  // instrumentation described in the architecture doc, §52.
  await supabase.from("interaction_events").insert({
    user_id: authData.user.id,
    event_type: "profile_created",
    interface_mode: "text",
    metadata: { slug },
  });

  return { success: true, profile: mapProfileRow(profile) };
}

export interface CraftsmanSearchFilters {
  query?: string;
  categoryId?: string;
  state?: string;
}

export interface CraftsmanSearchResult {
  id: string;
  slug: string;
  craftsmanName: string;
  villageTown: string;
  district: string;
  state: string;
  photoUrl?: string;
  yearsOfExperience?: number;
  verificationStatus: VerificationStatus;
  primaryCraftCategory?: CraftCategory;
  hasGiTag: boolean;
}

/**
 * Powers the /discover page (architecture doc §12). Searches only published
 * profiles -- draft/unpublished craftsmen never appear here, matching the
 * same rule enforced by RLS on direct profile reads.
 *
 * Product-level search ("by product") is deferred until Phase 5 adds the
 * products table; the query/category/state filters below cover the
 * craftsman-level fields that already exist.
 */
export async function searchCraftsmen(
  filters: CraftsmanSearchFilters
): Promise<CraftsmanSearchResult[]> {
  const supabase = await createClient();

  let request = supabase
    .from("craftsman_profiles")
    .select(
      "id, slug, craftsman_name, village_town, district, state, photo_url, years_of_experience, verification_status, primary_craft_category_id, gi_tags(id)"
    )
    .eq("profile_status", "published")
    .order("craftsman_name", { ascending: true })
    .limit(48);

  if (filters.categoryId) {
    request = request.or(
      `primary_craft_category_id.eq.${filters.categoryId},secondary_craft_category_id.eq.${filters.categoryId}`
    );
  }

  if (filters.state) {
    request = request.eq("state", filters.state);
  }

  if (filters.query) {
    const term = filters.query.trim();
    request = request.or(
      [
        `craftsman_name.ilike.%${term}%`,
        `craft_tradition.ilike.%${term}%`,
        `description.ilike.%${term}%`,
        `village_town.ilike.%${term}%`,
        `district.ilike.%${term}%`,
      ].join(",")
    );
  }

  const { data, error } = await request;
  if (error || !data) return [];

  const categoryById = new Map(CRAFT_CATEGORIES.map((c) => [c.id, c]));

  return data.map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    craftsmanName: row.craftsman_name as string,
    villageTown: row.village_town as string,
    district: row.district as string,
    state: row.state as string,
    photoUrl: (row.photo_url as string) ?? undefined,
    yearsOfExperience: (row.years_of_experience as number) ?? undefined,
    verificationStatus: row.verification_status as VerificationStatus,
    primaryCraftCategory: categoryById.get(row.primary_craft_category_id as string),
    hasGiTag: Array.isArray(row.gi_tags) && row.gi_tags.length > 0,
  }));
}

export interface ProfileEditInput {
  craftsmanName: string;
  yearsOfExperience?: number;
  registrationNumber?: string;
  registrationAuthority?: string;
  shopName?: string;
  businessAddress?: string;
  villageTown: string;
  district: string;
  state: string;
  pinCode?: string;
  gstNumber?: string;
  gstPublic: boolean;
  registrationPublic: boolean;
  shopContactNumber?: string;
  primaryCraftCategoryId: string;
  secondaryCraftCategoryId?: string;
  craftTradition?: string;
  description?: string;
  geographicRegion?: string;
  photoUrl?: string;
}

export interface DomainActionResult {
  success: boolean;
  error?: string;
}

/** Returns the signed-in user's own craftsman_profiles.id, or null if not signed in / no profile yet. */
async function getOwnCraftsmanId(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("craftsman_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data?.id as string) ?? null;
}

/**
 * Updates the signed-in craftsman's own profile fields. Scoped to the
 * caller's row via getOwnCraftsmanId() plus RLS as defense-in-depth --
 * the update itself is additionally filtered by user_id so it can never
 * touch another craftsman's row even if the id lookup were somehow wrong.
 */
export async function updateCraftsmanProfile(input: ProfileEditInput): Promise<DomainActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You need to sign in to edit your profile." };

  const { error } = await supabase
    .from("craftsman_profiles")
    .update({
      craftsman_name: input.craftsmanName,
      years_of_experience: input.yearsOfExperience ?? null,
      registration_number: input.registrationNumber || null,
      registration_authority: input.registrationAuthority || null,
      shop_name: input.shopName || null,
      address: input.businessAddress || null,
      village_town: input.villageTown,
      district: input.district,
      state: input.state,
      pin_code: input.pinCode || null,
      gst_number: input.gstNumber || null,
      gst_public: input.gstPublic,
      registration_public: input.registrationPublic,
      shop_contact_number: input.shopContactNumber || null,
      primary_craft_category_id: input.primaryCraftCategoryId,
      secondary_craft_category_id: input.secondaryCraftCategoryId || null,
      craft_tradition: input.craftTradition || null,
      description: input.description || null,
      geographic_region: input.geographicRegion || null,
      photo_url: input.photoUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "We couldn't save your changes. Please try again." };
  }
  return { success: true };
}

/**
 * Toggles the profile between draft and published. Published is the only
 * state that makes a profile publicly visible (see getPublishedCraftsmanProfileBySlug
 * and the "published profiles are publicly readable" RLS policy) -- this is
 * the single switch that flips that on or off.
 */
export async function setProfileStatus(
  status: "draft" | "published" | "unpublished"
): Promise<DomainActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You need to sign in to do that." };

  const { error } = await supabase
    .from("craftsman_profiles")
    .update({ profile_status: status, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "We couldn't update your profile's visibility. Please try again." };
  }
  return { success: true };
}

export async function addAward(input: {
  name: string;
  level: "national" | "state" | "other";
  year?: number;
  issuingOrganization?: string;
}): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  if (!input.name.trim()) {
    return { success: false, error: "Please enter an award name." };
  }

  const { error } = await supabase.from("awards").insert({
    craftsman_id: craftsmanId,
    name: input.name,
    level: input.level,
    year: input.year ?? null,
    issuing_organization: input.issuingOrganization || null,
    verification_status: "unverified",
  });

  if (error) return { success: false, error: "We couldn't add that award. Please try again." };
  return { success: true };
}

export async function deleteAward(awardId: string): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  const { error } = await supabase
    .from("awards")
    .delete()
    .eq("id", awardId)
    .eq("craftsman_id", craftsmanId);

  if (error) return { success: false, error: "We couldn't remove that award. Please try again." };
  return { success: true };
}

export async function addGiTag(input: {
  giTagName: string;
  referenceNumber?: string;
}): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  if (!input.giTagName.trim()) {
    return { success: false, error: "Please enter the GI tag name." };
  }

  const { error } = await supabase.from("gi_tags").insert({
    craftsman_id: craftsmanId,
    gi_tag_name: input.giTagName,
    reference_number: input.referenceNumber || null,
    verification_status: "unverified",
  });

  if (error) return { success: false, error: "We couldn't add that GI tag. Please try again." };
  return { success: true };
}

export async function deleteGiTag(giTagId: string): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  const { error } = await supabase
    .from("gi_tags")
    .delete()
    .eq("id", giTagId)
    .eq("craftsman_id", craftsmanId);

  if (error) return { success: false, error: "We couldn't remove that GI tag. Please try again." };
  return { success: true };
}

export interface MyCraftsmanProfileResult {
  profile: CraftsmanProfileWithRelations | null;
  /** True if the user is authenticated but has no craftsman_profiles row yet. */
  userId: string | null;
}

/**
 * Fetches the *currently signed-in* craftsman's own profile, including
 * awards/GI tags regardless of their verification status (unlike the public
 * getPublishedCraftsmanProfileBySlug, which only shows verified items).
 * Relies on RLS ("craftsmen manage their own profile") to scope this to the
 * caller's own row -- no explicit user_id filter is even required, but one
 * is added anyway for clarity and defense-in-depth.
 */
export async function getMyCraftsmanProfile(): Promise<MyCraftsmanProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { profile: null, userId: null };

  const { data: profile } = await supabase
    .from("craftsman_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) return { profile: null, userId: user.id };

  const [{ data: awardRows }, { data: giRows }] = await Promise.all([
    supabase.from("awards").select("*").eq("craftsman_id", profile.id),
    supabase.from("gi_tags").select("*").eq("craftsman_id", profile.id),
  ]);

  const categoryById = new Map(CRAFT_CATEGORIES.map((c) => [c.id, c]));

  return {
    userId: user.id,
    profile: {
      ...mapProfileRow(profile),
      primaryCraftCategory: categoryById.get(profile.primary_craft_category_id),
      secondaryCraftCategory: profile.secondary_craft_category_id
        ? categoryById.get(profile.secondary_craft_category_id)
        : undefined,
      awards: (awardRows ?? []).map(mapAwardRow),
      giTags: (giRows ?? []).map(mapGiTagRow),
    },
  };
}

/**
 * Fetches a single craftsman's PUBLIC profile by slug, for the
 * /craftsman/[slug] page. Only returns published profiles -- a draft or
 * unpublished profile is treated as not-found from the public side, even
 * if the slug is guessed correctly, since RLS also enforces this at the
 * database level (see supabase/migrations/0001, "published profiles are
 * publicly readable"). This function is the single source of truth the
 * Text/Icon/Voice-mode profile views all read from.
 */
export async function getPublishedCraftsmanProfileBySlug(
  slug: string
): Promise<CraftsmanProfileWithRelations | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("craftsman_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("profile_status", "published")
    .maybeSingle();

  if (!profile) return null;

  const [{ data: awardRows }, { data: giRows }] = await Promise.all([
    supabase
      .from("awards")
      .select("*")
      .eq("craftsman_id", profile.id)
      .eq("verification_status", "verified"),
    supabase
      .from("gi_tags")
      .select("*")
      .eq("craftsman_id", profile.id)
      .eq("verification_status", "verified"),
  ]);

  const categoryById = new Map(CRAFT_CATEGORIES.map((c) => [c.id, c]));

  return {
    ...mapProfileRow(profile),
    primaryCraftCategory: categoryById.get(profile.primary_craft_category_id),
    secondaryCraftCategory: profile.secondary_craft_category_id
      ? categoryById.get(profile.secondary_craft_category_id)
      : undefined,
    awards: (awardRows ?? []).map(mapAwardRow),
    giTags: (giRows ?? []).map(mapGiTagRow),
  };
}

function mapAwardRow(row: Record<string, unknown>): Award {
  return {
    id: row.id as string,
    craftsmanId: row.craftsman_id as string,
    name: row.name as string,
    level: row.level as Award["level"],
    year: (row.year as number) ?? undefined,
    issuingOrganization: (row.issuing_organization as string) ?? undefined,
    certificateUrl: (row.certificate_url as string) ?? undefined,
    verificationStatus: row.verification_status as Award["verificationStatus"],
  };
}

function mapGiTagRow(row: Record<string, unknown>): GITag {
  return {
    id: row.id as string,
    craftsmanId: row.craftsman_id as string,
    giTagName: row.gi_tag_name as string,
    referenceNumber: (row.reference_number as string) ?? undefined,
    certificateUrl: (row.certificate_url as string) ?? undefined,
    verificationStatus: row.verification_status as GITag["verificationStatus"],
  };
}

// Converts a snake_case DB row into the camelCase domain type used across the UI.
function mapProfileRow(row: Record<string, unknown>): CraftsmanProfile {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    slug: row.slug as string,
    craftsmanName: row.craftsman_name as string,
    registrationNumber: (row.registration_number as string) ?? undefined,
    registrationAuthority: (row.registration_authority as string) ?? undefined,
    shopName: (row.shop_name as string) ?? undefined,
    address: (row.address as string) ?? undefined,
    shopContactNumber: (row.shop_contact_number as string) ?? undefined,
    villageTown: row.village_town as string,
    district: row.district as string,
    state: row.state as string,
    pinCode: (row.pin_code as string) ?? undefined,
    gstNumber: (row.gst_number as string) ?? undefined,
    gstPublic: Boolean(row.gst_public),
    registrationPublic: Boolean(row.registration_public),
    primaryCraftCategoryId: row.primary_craft_category_id as string,
    secondaryCraftCategoryId: (row.secondary_craft_category_id as string) ?? undefined,
    craftTradition: (row.craft_tradition as string) ?? undefined,
    description: (row.description as string) ?? undefined,
    geographicRegion: (row.geographic_region as string) ?? undefined,
    yearsOfExperience: (row.years_of_experience as number) ?? undefined,
    photoUrl: (row.photo_url as string) ?? undefined,
    verificationStatus: row.verification_status as CraftsmanProfile["verificationStatus"],
    profileStatus: row.profile_status as CraftsmanProfile["profileStatus"],
    interfaceModePreference: row.interface_mode_preference as CraftsmanProfile["interfaceModePreference"],
    localePreference: row.locale_preference as CraftsmanProfile["localePreference"],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
