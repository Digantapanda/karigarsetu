"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Only ever uses the public anon key --
// the service-role key must never appear in frontend code (architecture doc, §22).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
