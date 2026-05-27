import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database/types";
import { getSupabaseEnv } from "@/lib/supabase/config";

export async function createServerSupabaseClient(): Promise<
  SupabaseClient<Database> | null
> {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(env.url, env.publishableKey, {
    global: {
      fetch: (url, init) =>
        fetch(url, {
          ...init,
          cache: "no-store",
        }),
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component that cannot set cookies.
        }
      },
    },
  });
}
