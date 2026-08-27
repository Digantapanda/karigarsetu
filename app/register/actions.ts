"use server";

import { createCraftsmanProfile, type CreateCraftsmanProfileResult } from "@/lib/domain/craftsman";
import type { CraftsmanRegistrationInput } from "@/types/domain";

// Thin Server Action wrapper. Kept deliberately empty of business logic --
// all of that lives in lib/domain so Icon Mode and Voice Mode can call the
// exact same function without going through this HTTP-shaped boundary.
export async function submitCraftsmanRegistration(
  input: CraftsmanRegistrationInput
): Promise<CreateCraftsmanProfileResult> {
  return createCraftsmanProfile(input);
}
