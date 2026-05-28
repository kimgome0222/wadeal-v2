import { NextResponse } from "next/server";

import {
  decodeKakaoOAuthState,
  exchangeKakaoCode,
  fetchKakaoProfile,
  isKakaoOAuthConfigured,
} from "@/lib/auth/kakao-oauth-server";
import { ensureKakaoSupabaseUser } from "@/lib/auth/supabase-session";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const code = requestUrl.searchParams.get("code");
  const oauthError = requestUrl.searchParams.get("error");
  const oauthErrorDescription = requestUrl.searchParams.get("error_description");
  const { redirect } = decodeKakaoOAuthState(requestUrl.searchParams.get("state"));

  if (oauthError) {
    console.error("[auth/kakao/callback]", oauthError, oauthErrorDescription ?? "");
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=${encodeURIComponent(oauthError)}&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=missing_code&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  if (!isKakaoOAuthConfigured()) {
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=kakao_env&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  try {
    const accessToken = await exchangeKakaoCode(code, origin);
    const profile = await fetchKakaoProfile(accessToken);
    await ensureKakaoSupabaseUser(profile);

    return NextResponse.redirect(`${origin}${redirect}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "kakao_callback_failed";
    console.error("[auth/kakao/callback]", message);
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=${encodeURIComponent(message)}&redirect=${encodeURIComponent(redirect)}`,
    );
  }
}
