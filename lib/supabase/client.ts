import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database/types";
import { getSupabaseEnv } from "@/lib/supabase/config";

let browserClient: SupabaseClient<Database> | null = null;

export function createBrowserSupabaseClient(): SupabaseClient<Database> | null {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient<Database>(env.url, env.anonKey);
  }

  return browserClient;
}
