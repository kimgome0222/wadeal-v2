import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database/types";
import { getSupabaseEnv } from "@/lib/supabase/config";

/** Server-only Supabase client for webhooks and background jobs (bypasses RLS). */
export function createServiceRoleSupabaseClient(): SupabaseClient<Database> | null {
  const env = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!env || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(env.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
