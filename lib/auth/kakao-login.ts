"use client";

import { safeRedirectPath } from "@/lib/auth/safe-redirect";

export async function signInWithKakao(afterLoginPath: string): Promise<void> {
  const redirect = safeRedirectPath(afterLoginPath);
  const startUrl = `/api/auth/kakao/start?redirect=${encodeURIComponent(redirect)}`;

  window.location.assign(startUrl);
}
