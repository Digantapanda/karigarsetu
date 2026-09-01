"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { INTERFACE_MODE_COOKIE, isInterfaceMode } from "@/lib/interface-mode/config";

export async function setInterfaceMode(formData: FormData) {
  const value = String(formData.get("mode") ?? "");
  if (!isInterfaceMode(value)) return;

  const cookieStore = await cookies();
  cookieStore.set(INTERFACE_MODE_COOKIE, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  // Per architecture doc §33: guests get localStorage/cookie persistence,
  // signed-in craftsmen get it saved to their profile. We use a cookie for
  // both (simpler, works identically server- and client-side) but for a
  // signed-in craftsman we ALSO write it to interface_mode_preference --
  // a column that's existed since the first migration but nothing ever
  // set until now -- so the preference is genuinely theirs, not just this
  // browser's.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("craftsman_profiles")
      .update({ interface_mode_preference: value, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
  }

  revalidatePath("/", "layout");
}
