import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database/types";

let browserClient: SupabaseClient<Database> | null | undefined;

export function createBrowserSupabaseClient(): SupabaseClient<Database> | null {
  if (browserClient !== undefined) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    browserClient = null;
    return null;
  }

  browserClient = createBrowserClient<Database>(url, publishableKey);
  return browserClient;
}

export function resetBrowserSupabaseClient(): void {
  browserClient = undefined;
}
