import { createClient } from "@/lib/supabase/server";

export interface SignInResult {
  success: boolean;
  /** Plain-language error, safe to show directly in any interface mode. */
  error?: string;
}

export async function signInCraftsman(email: string, password: string): Promise<SignInResult> {
  if (!email.trim() || !password) {
    return { success: false, error: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase returns the same generic message for "no such user" and
    // "wrong password" by design (avoids leaking which emails are
    // registered), so we can safely pass a slightly friendlier version
    // straight through rather than guessing at specifics.
    return {
      success: false,
      error: "We couldn't sign you in. Please check your email and password and try again.",
    };
  }

  return { success: true };
}

export async function signOutCraftsman(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
