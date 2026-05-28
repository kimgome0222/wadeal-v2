import { NextResponse } from "next/server";

import {
  buildKakaoAuthorizeUrl,
  encodeKakaoOAuthState,
  isKakaoOAuthConfigured,
} from "@/lib/auth/kakao-oauth-server";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const redirect = safeRedirectPath(requestUrl.searchParams.get("redirect"));
  const origin = requestUrl.origin;

  if (!isKakaoOAuthConfigured()) {
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=kakao_env&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  const state = encodeKakaoOAuthState({ redirect });
  const authorizeUrl = buildKakaoAuthorizeUrl(origin, state);

  return NextResponse.redirect(authorizeUrl);
}
