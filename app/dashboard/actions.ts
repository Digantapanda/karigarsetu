"use server";

import { redirect } from "next/navigation";
import { signOutCraftsman } from "@/lib/domain/auth";

export async function submitLogout() {
  await signOutCraftsman();
  redirect("/login");
}
