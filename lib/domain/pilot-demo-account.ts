import crypto from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient as createSsrClient } from "@/lib/supabase/server";

/**
 * Pilot tasks run on the real KarigarSetu app (dashboard, product form,
 * public profile), not a mock-up -- so each participant needs a real,
 * working craftsman account. This provisions one automatically the first
 * time a participant starts their first condition, and resets its mutable
 * state (currently: products) before each subsequent condition so Task 2
 * ("add a product") is equally completable all three times.
 *
 * The account is real but throwaway: a fake @pilot.karigarsetu.local
 * email, a password derived deterministically from the participant id
 * (never stored in plaintext) so the same account can be signed back into
 * for conditions 2 and 3, and a published profile with placeholder
 * business details so the dashboard loads normally instead of showing an
 * empty/unfinished-registration state.
 */

function pilotEmailFor(participantCode: string): string {
  return `pilot-${participantCode.toLowerCase()}@pilot.karigarsetu.local`;
}

function pilotPasswordFor(participantId: string): string {
  const secret = process.env.PILOT_DEMO_ACCOUNT_SECRET || process.env.PILOT_ADMIN_PASSWORD || "";
  if (!secret) {
    throw new Error("PILOT_DEMO_ACCOUNT_SECRET is not set -- see .env.example.");
  }
  // Deterministic, so the same account can be re-derived and signed into
  // on later conditions without persisting the password anywhere.
  return crypto.createHmac("sha256", secret).update(participantId).digest("hex").slice(0, 32);
}

export interface DemoAccountResult {
  success: boolean;
  error?: string;
  craftsmanId?: string;
  slug?: string;
}

/**
 * Ensures a demo craftsman account exists for this participant (creating
 * it on first use), resets its products so each condition starts from the
 * same baseline, and signs the current browser session into it via the
 * cookie-aware SSR client so the participant lands on their own real
 * /dashboard.
 */
export async function provisionOrResetDemoAccount(
  participantId: string,
  participantCode: string,
  craftsmanDisplayName: string
): Promise<DemoAccountResult> {
  const service = createServiceRoleClient();
  const email = pilotEmailFor(participantCode);
  const password = pilotPasswordFor(participantId);

  const { data: participant } = await service
    .from("pilot_participants")
    .select("demo_user_id, demo_craftsman_id")
    .eq("id", participantId)
    .maybeSingle();

  let userId = participant?.demo_user_id as string | undefined;
  let craftsmanId = participant?.demo_craftsman_id as string | undefined;

  if (!userId || !craftsmanId) {
    // First condition for this participant -- create the auth user and
    // their craftsman profile from scratch.
    const { data: created, error: createError } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created.user) {
      return { success: false, error: "Could not create the demo account." };
    }
    userId = created.user.id;

    const baseSlug = `pilot-${participantCode.toLowerCase()}`;
    const { data: profile, error: profileError } = await service
      .from("craftsman_profiles")
      .insert({
        user_id: userId,
        slug: baseSlug,
        craftsman_name: craftsmanDisplayName || "Pilot Participant",
        village_town: "Pilot Study",
        district: "Pilot Study",
        state: "West Bengal",
        primary_craft_category_id: "other",
        verification_status: "unverified",
        profile_status: "published",
        interface_mode_preference: "text",
        locale_preference: "en",
      })
      .select("id")
      .single();

    if (profileError || !profile) {
      return { success: false, error: "Could not create the demo profile." };
    }
    craftsmanId = profile.id as string;

    await service
      .from("pilot_participants")
      .update({ demo_user_id: userId, demo_craftsman_id: craftsmanId })
      .eq("id", participantId);
  } else {
    // Returning for condition 2 or 3 -- reset mutable state so the task
    // ("add a product") is equally completable each time.
    await service.from("products").delete().eq("craftsman_id", craftsmanId);
  }

  // Sign the participant's browser into this account for real, via the
  // cookie-aware server client (not the service-role client) so the
  // resulting session cookies are the ones the browser actually uses.
  const ssr = await createSsrClient();
  const { error: signInError } = await ssr.auth.signInWithPassword({ email, password });
  if (signInError) {
    return { success: false, error: "Could not sign in to the demo account." };
  }

  const { data: slugRow } = await service
    .from("craftsman_profiles")
    .select("slug")
    .eq("id", craftsmanId)
    .maybeSingle();

  return { success: true, craftsmanId, slug: (slugRow?.slug as string) ?? undefined };
}
