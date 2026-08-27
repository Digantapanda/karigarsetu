"use server";

import { redirect } from "next/navigation";
import { signInCraftsman } from "@/lib/domain/auth";

export async function submitLogin(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await signInCraftsman(email, password);
  if (!result.success) {
    return { error: result.error };
  }

  redirect("/dashboard");
}
