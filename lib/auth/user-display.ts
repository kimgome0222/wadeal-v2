import type { User } from "@supabase/supabase-js";

const SOCIAL_AUTH_PROVIDERS = new Set(["kakao", "google", "naver"]);

export function getAuthProviderId(user: User): string | null {
  const identityProvider = user.identities?.find((identity) => identity.provider)?.provider;

  if (identityProvider) {
    return identityProvider;
  }

  if (typeof user.app_metadata?.provider === "string") {
    return user.app_metadata.provider;
  }

  return null;
}

export function isSocialAuthUser(user: User): boolean {
  const provider = getAuthProviderId(user);
  return provider !== null && SOCIAL_AUTH_PROVIDERS.has(provider);
}

export function getSocialAuthLoginMessage(user: User): string {
  const provider = getAuthProviderLabel(user);
  if (provider) {
    return `${provider} 계정으로 로그인 중입니다`;
  }

  return "연동된 소셜 계정으로 로그인 중입니다";
}

export function getAuthDisplayName(user: User): string {
  const metadata = user.user_metadata ?? {};

  if (typeof metadata.full_name === "string" && metadata.full_name) {
    return metadata.full_name;
  }

  if (typeof metadata.name === "string" && metadata.name) {
    return metadata.name;
  }

  if (typeof metadata.nickname === "string" && metadata.nickname) {
    return metadata.nickname;
  }

  if (user.email) {
    return user.email.split("@")[0] ?? "회원";
  }

  return "회원";
}

export function getAuthProviderLabel(user: User): string | null {
  const provider = getAuthProviderId(user);

  if (!provider) {
    return null;
  }

  if (provider === "kakao") {
    return "카카오";
  }

  if (provider === "google") {
    return "Google";
  }

  if (provider === "naver") {
    return "네이버";
  }

  if (provider === "prototype") {
    return "데모";
  }

  return provider;
}

export function getAuthIdentityLine(user: User): string {
  if (user.email && !user.email.endsWith("@wadeal.local")) {
    return user.email;
  }

  return user.id;
}

export function getAuthCompletionLabel(user: User): string {
  const provider = getAuthProviderLabel(user);

  if (provider === "카카오") {
    return "카카오 로그인 완료";
  }

  if (provider === "데모") {
    return "데모 로그인 완료";
  }

  if (provider) {
    return `${provider} 로그인 완료`;
  }

  return "로그인 완료";
}
