import type { User } from "@supabase/supabase-js";
import { cache } from "react";

import { getPrototypeUserIfSession } from "@/lib/auth/prototype-session";
import { isPrototypeAuthEnabled } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export {
  getAuthCompletionLabel,
  getAuthDisplayName,
  getAuthIdentityLine,
  getAuthProviderLabel,
  getSocialAuthLoginMessage,
  isSocialAuthUser,
} from "@/lib/auth/user-display";

function isMissingSessionError(message: string): boolean {
  return (
    message.includes("Auth session missing") ||
    message.includes("JWT") ||
    message.includes("session")
  );
}

export const getServerAuthUser = cache(async (): Promise<User | null> => {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user) {
      return user;
    }

    if (error && process.env.NODE_ENV === "development" && !isMissingSessionError(error.message)) {
      console.error("[auth] getServerAuthUser:", error.message);
    }
  }

  if (isPrototypeAuthEnabled()) {
    const prototypeUser = await getPrototypeUserIfSession();
    if (prototypeUser) {
      return prototypeUser;
    }
  }

  if (isSupabaseConfigured()) {
    return null;
  }

  return null;
});
