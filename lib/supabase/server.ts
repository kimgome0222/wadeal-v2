import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database/types";
import { getSupabaseEnv } from "@/lib/supabase/config";

export function createServerSupabaseClient(): SupabaseClient<Database> | null {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  return createClient<Database>(env.url, env.anonKey);
}
