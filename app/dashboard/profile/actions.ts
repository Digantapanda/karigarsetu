"use server";

import { revalidatePath } from "next/cache";
import {
  updateCraftsmanProfile,
  setProfileStatus,
  addAward,
  deleteAward,
  addGiTag,
  deleteGiTag,
  type ProfileEditInput,
  type DomainActionResult,
} from "@/lib/domain/craftsman";
import { profileEditSchema } from "@/lib/validation/profile-edit";

export async function submitProfileEdit(input: ProfileEditInput): Promise<DomainActionResult> {
  const parsed = profileEditSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Some details are missing or invalid. Please check the form." };
  }
  const result = await updateCraftsmanProfile(parsed.data);
  if (result.success) revalidatePath("/dashboard/profile");
  return result;
}

export async function togglePublish(publish: boolean): Promise<DomainActionResult> {
  const result = await setProfileStatus(publish ? "published" : "unpublished");
  if (result.success) {
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
  }
  return result;
}

export async function submitAddAward(formData: FormData): Promise<DomainActionResult> {
  const result = await addAward({
    name: String(formData.get("name") ?? ""),
    level: (formData.get("level") as "national" | "state" | "other") ?? "other",
    year: formData.get("year") ? Number(formData.get("year")) : undefined,
    issuingOrganization: String(formData.get("issuingOrganization") ?? ""),
  });
  if (result.success) revalidatePath("/dashboard/profile");
  return result;
}

export async function submitDeleteAward(awardId: string): Promise<DomainActionResult> {
  const result = await deleteAward(awardId);
  if (result.success) revalidatePath("/dashboard/profile");
  return result;
}

export async function submitAddGiTag(formData: FormData): Promise<DomainActionResult> {
  const result = await addGiTag({
    giTagName: String(formData.get("giTagName") ?? ""),
    referenceNumber: String(formData.get("referenceNumber") ?? ""),
  });
  if (result.success) revalidatePath("/dashboard/profile");
  return result;
}

export async function submitDeleteGiTag(giTagId: string): Promise<DomainActionResult> {
  const result = await deleteGiTag(giTagId);
  if (result.success) revalidatePath("/dashboard/profile");
  return result;
}
