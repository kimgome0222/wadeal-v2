"use client";

import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export async function signInWithKakao(afterLoginPath: string): Promise<void> {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured for OAuth login.");
  }

  const redirect = safeRedirectPath(afterLoginPath);
  const redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo,
      scopes: "profile_nickname profile_image",
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
