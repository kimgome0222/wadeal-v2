import { safeRedirectPath } from "@/lib/auth/safe-redirect";

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const KAKAO_USER_URL = "https://kapi.kakao.com/v2/user/me";

export type KakaoOAuthState = {
  redirect: string;
};

export function isKakaoOAuthConfigured(): boolean {
  return Boolean(
    process.env.KAKAO_REST_API_KEY && process.env.KAKAO_CLIENT_SECRET,
  );
}

export function encodeKakaoOAuthState(state: KakaoOAuthState): string {
  return Buffer.from(JSON.stringify(state)).toString("base64url");
}

export function decodeKakaoOAuthState(value: string | null): KakaoOAuthState {
  if (!value) {
    return { redirect: "/" };
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as KakaoOAuthState;

    return { redirect: safeRedirectPath(parsed.redirect) };
  } catch {
    return { redirect: "/" };
  }
}

export function getKakaoCallbackUrl(origin: string): string {
  return `${origin}/auth/kakao/callback`;
}

export function buildKakaoAuthorizeUrl(origin: string, state: string): string {
  const restApiKey = process.env.KAKAO_REST_API_KEY;
  if (!restApiKey) {
    throw new Error("KAKAO_REST_API_KEY is not configured.");
  }

  const params = new URLSearchParams({
    client_id: restApiKey,
    redirect_uri: getKakaoCallbackUrl(origin),
    response_type: "code",
    scope: "profile_nickname profile_image",
    state,
  });

  return `${KAKAO_AUTH_URL}?${params.toString()}`;
}

type KakaoTokenResponse = {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in?: number;
};

type KakaoUserResponse = {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
};

export type KakaoProfile = {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
};

export async function exchangeKakaoCode(
  code: string,
  origin: string,
): Promise<string> {
  const restApiKey = process.env.KAKAO_REST_API_KEY;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;

  if (!restApiKey || !clientSecret) {
    throw new Error("Kakao OAuth server credentials are not configured.");
  }

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: restApiKey,
      client_secret: clientSecret,
      redirect_uri: getKakaoCallbackUrl(origin),
      code,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Kakao token exchange failed: ${body}`);
  }

  const token = (await response.json()) as KakaoTokenResponse;
  return token.access_token;
}

export async function fetchKakaoProfile(
  accessToken: string,
): Promise<KakaoProfile> {
  const response = await fetch(KAKAO_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Kakao profile fetch failed: ${body}`);
  }

  const user = (await response.json()) as KakaoUserResponse;

  return {
    id: String(user.id),
    nickname: user.kakao_account?.profile?.nickname ?? "Wadeal 사용자",
    profileImageUrl: user.kakao_account?.profile?.profile_image_url ?? null,
  };
}

export function getKakaoAuthEmail(kakaoId: string): string {
  return `kakao.${kakaoId}@users.wadeal.local`;
}
