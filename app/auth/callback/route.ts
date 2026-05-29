import { NextResponse } from "next/server";

import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { syncAuthUserToPublicProfile } from "@/lib/auth/sync-user-profile";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const oauthError = requestUrl.searchParams.get("error");
  const oauthErrorDescription = requestUrl.searchParams.get("error_description");
  const redirect = safeRedirectPath(
    requestUrl.searchParams.get("redirect") ?? "/mypage",
  );
  const origin = requestUrl.origin;

  const response = NextResponse.redirect(`${origin}${redirect}`);
  const supabase = createRouteHandlerSupabaseClient(response, request);

  if (oauthError) {
    console.error("[auth/callback]", oauthError, oauthErrorDescription ?? "");
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=${encodeURIComponent(oauthError)}&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=missing_code&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  if (!supabase) {
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=supabase&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback]", error.message);
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirect)}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await syncAuthUserToPublicProfile(user, supabase);
  }

  return response;
}
