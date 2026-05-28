import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database/types";
import { getSupabaseEnv } from "@/lib/supabase/config";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

function createSupabaseServerClient(cookieMethods: {
  getAll: () => { name: string; value: string }[];
  setAll: (cookiesToSet: CookieToSet[]) => void;
}): SupabaseClient<Database> | null {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  return createServerClient<Database>(env.url, env.publishableKey, {
    global: {
      fetch: (url, init) =>
        fetch(url, {
          ...init,
          cache: "no-store",
        }),
    },
    cookies: cookieMethods,
  });
}

export async function createServerSupabaseClient(): Promise<
  SupabaseClient<Database> | null
> {
  const cookieStore = await cookies();

  return createSupabaseServerClient({
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // Server Components cannot always set cookies.
      }
    },
  });
}

export function createRouteHandlerSupabaseClient(
  response: NextResponse,
  request: Request,
): SupabaseClient<Database> | null {
  return createSupabaseServerClient({
    getAll() {
      return parseCookieHeader(request.headers.get("cookie") ?? "").flatMap(
        (cookie) =>
          cookie.value !== undefined
            ? [{ name: cookie.name, value: cookie.value }]
            : [],
      );
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
    },
  });
}
