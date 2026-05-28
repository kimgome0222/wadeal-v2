"use client";

import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export async function signInWithKakao(afterLoginPath: string): Promise<boolean> {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return false;
  }

  const redirect = safeRedirectPath(afterLoginPath);
  const redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo,
      // Omit account_email; enable "Allow users without an email" in Supabase Kakao settings.
      scopes: "profile_nickname profile_image",
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
