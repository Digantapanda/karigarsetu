import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client: bypasses Row Level Security entirely. This must
 * NEVER be imported into a Client Component or any code path that could
 * ship to the browser -- the `server-only` import above makes Next.js
 * throw a build error if that ever happens by accident.
 *
 * Currently used only by the pilot study module (lib/domain/pilot.ts and
 * app/pilot/admin/export), which intentionally has zero RLS policies for
 * anon/authenticated roles (see supabase/migrations/0005_pilot_study.sql)
 * and relies entirely on this client, gated by the server-side admin
 * password check, to read and write pilot data.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. The pilot study module requires it -- see .env.example."
    );
  }

  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
