// Domain types shared by every interface mode (Text / Icon / Voice).
// These mirror the `craftsman_profiles` table from the architecture doc
// (see karigarsetu-architecture.md, section C) so the UI layer and the
// database schema never drift apart.

export type VerificationStatus =
  | "unverified"
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected"
  | "needs_more_info";

export type ProfileStatus = "draft" | "published" | "unpublished";

export type InterfaceMode = "text" | "icon" | "voice";

export type LocaleCode = "en" | "hi" | "bn";

// ---- Step 1: Basic Account ----
export interface BasicAccountInput {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
}

// ---- Step 2: Craftsman Information ----
export interface CraftsmanInfoInput {
  craftsmanName: string;
  registrationNumber?: string;
  registrationAuthority?: string;
  craftCategoryId: string;
  yearsOfExperience?: number;
}

// ---- Step 3: Business Information ----
export interface BusinessInfoInput {
  shopName?: string;
  businessAddress?: string;
  villageTown: string;
  district: string;
  state: string;
  pinCode?: string;
  gstNumber?: string;
  shopContactNumber?: string;
}

// ---- Step 4: Craft Information ----
export interface CraftInfoInput {
  primaryCraftCategoryId: string;
  secondaryCraftCategoryId?: string;
  craftTradition?: string;
  craftDescription?: string;
  geographicRegion?: string;
}

// ---- Step 5: Recognition ----
export interface RecognitionInput {
  giTag: boolean;
  giTagName?: string;
  giReferenceNumber?: string;
  nationalAward?: string;
  stateAward?: string;
  otherRecognition?: string;
}

export interface CraftsmanRegistrationInput {
  account: BasicAccountInput;
  craftsmanInfo: CraftsmanInfoInput;
  businessInfo: BusinessInfoInput;
  craftInfo: CraftInfoInput;
  recognition: RecognitionInput;
}

export interface CraftCategory {
  id: string;
  name: string;
  slug: string;
  iconKey?: string;
}

export interface CraftsmanProfile {
  id: string;
  userId: string;
  slug: string;
  craftsmanName: string;
  registrationNumber?: string;
  registrationAuthority?: string;
  shopName?: string;
  address?: string;
  shopContactNumber?: string;
  villageTown: string;
  district: string;
  state: string;
  pinCode?: string;
  gstNumber?: string;
  gstPublic: boolean;
  registrationPublic: boolean;
  primaryCraftCategoryId: string;
  secondaryCraftCategoryId?: string;
  craftTradition?: string;
  description?: string;
  geographicRegion?: string;
  yearsOfExperience?: number;
  photoUrl?: string;
  verificationStatus: VerificationStatus;
  profileStatus: ProfileStatus;
  interfaceModePreference: InterfaceMode;
  localePreference: LocaleCode;
  createdAt: string;
  updatedAt: string;
}

export interface Award {
  id: string;
  craftsmanId: string;
  name: string;
  level: "national" | "state" | "other";
  year?: number;
  issuingOrganization?: string;
  certificateUrl?: string;
  verificationStatus: VerificationStatus;
}

export interface GITag {
  id: string;
  craftsmanId: string;
  giTagName: string;
  referenceNumber?: string;
  certificateUrl?: string;
  verificationStatus: VerificationStatus;
}

export interface CraftsmanProfileWithRelations extends CraftsmanProfile {
  primaryCraftCategory?: CraftCategory;
  secondaryCraftCategory?: CraftCategory;
  awards: Award[];
  giTags: GITag[];
}

export type ProductStatus = "draft" | "published" | "out_of_stock" | "archived";
export type ProductAvailability = "in_stock" | "made_to_order" | "out_of_stock";
export type PriceType = "fixed" | "on_request";

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  sortOrder: number;
  altText?: string;
}

export interface Product {
  id: string;
  craftsmanId: string;
  name: string;
  categoryId?: string;
  category?: CraftCategory;
  description?: string;
  materials?: string;
  technique?: string;
  price?: number;
  currency: string;
  priceType: PriceType;
  availability: ProductAvailability;
  stockQuantity?: number;
  minOrderQty?: number;
  dimensions?: string;
  weight?: string;
  customizable: boolean;
  productionTime?: string;
  videoUrl?: string;
  status: ProductStatus;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

// Fields the craftsman is allowed to toggle public/private post-registration.
export const PROFILE_VISIBILITY_FIELDS = ["gstPublic", "registrationPublic"] as const;
