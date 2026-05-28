"use client";

import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const KAKAO_SCOPES = "profile_nickname profile_image";

export async function signInWithKakaoOAuth(
  afterLoginPath: string,
): Promise<void> {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const redirect = safeRedirectPath(afterLoginPath);
  const redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo,
      scopes: KAKAO_SCOPES,
      queryParams: {
        scope: KAKAO_SCOPES,
      },
    },
  });

  if (error) {
    throw error;
  }
}
