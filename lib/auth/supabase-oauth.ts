"use client";

import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const KAKAO_OAUTH_SCOPES = "profile_nickname profile_image";

export async function signInWithKakaoOAuth(
  afterLoginPath = "/mypage",
): Promise<void> {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const redirect = safeRedirectPath(afterLoginPath);
  const redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo,
      scopes: KAKAO_OAUTH_SCOPES,
    },
  });

  if (error) {
    throw error;
  }

  if (data?.url) {
    window.location.href = data.url;
    return;
  }

  throw new Error("OAuth redirect URL was not returned.");
}

export async function signInWithGoogleOAuth(
  afterLoginPath = "/mypage",
): Promise<void> {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const redirect = safeRedirectPath(afterLoginPath);
  const redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    throw error;
  }

  if (data?.url) {
    window.location.href = data.url;
    return;
  }

  throw new Error("OAuth redirect URL was not returned.");
}
