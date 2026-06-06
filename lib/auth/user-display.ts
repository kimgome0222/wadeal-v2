import type { User } from "@supabase/supabase-js";

import type { UserProfile } from "@/lib/profile/types";

const SOCIAL_AUTH_PROVIDERS = new Set(["kakao", "google", "naver"]);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type HeaderUserInfo = {
  displayName: string;
  identityLine: string;
  memberGrade?: string;
};

export function isUuidLike(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  return UUID_PATTERN.test(value.trim());
}

function isUsableDisplayName(value: string | null | undefined): value is string {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  if (trimmed.length < 2) {
    return false;
  }

  return !isUuidLike(trimmed);
}

function pickFirstUsableName(...candidates: Array<string | null | undefined>): string | null {
  for (const candidate of candidates) {
    if (isUsableDisplayName(candidate)) {
      return candidate.trim();
    }
  }

  return null;
}

function readIdentityDataName(user: User): string | null {
  for (const identity of user.identities ?? []) {
    const data = identity.identity_data as Record<string, unknown> | undefined;
    if (!data) {
      continue;
    }

    const fromIdentity = pickFirstUsableName(
      typeof data.nickname === "string" ? data.nickname : null,
      typeof data.name === "string" ? data.name : null,
      typeof data.full_name === "string" ? data.full_name : null,
      typeof data.preferred_username === "string" ? data.preferred_username : null,
      typeof data.user_name === "string" ? data.user_name : null,
    );

    if (fromIdentity) {
      return fromIdentity;
    }
  }

  return null;
}

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

  const fromMetadata = pickFirstUsableName(
    typeof metadata.full_name === "string" ? metadata.full_name : null,
    typeof metadata.name === "string" ? metadata.name : null,
    typeof metadata.nickname === "string" ? metadata.nickname : null,
    typeof metadata.preferred_username === "string" ? metadata.preferred_username : null,
    typeof metadata.user_name === "string" ? metadata.user_name : null,
    readIdentityDataName(user),
  );

  if (fromMetadata) {
    return fromMetadata;
  }

  if (user.email && !user.email.endsWith("@wadeal.local")) {
    const localPart = user.email.split("@")[0];
    if (isUsableDisplayName(localPart)) {
      return localPart;
    }
  }

  const provider = getAuthProviderLabel(user);
  if (provider) {
    return `${provider} 회원`;
  }

  return "회원";
}

export function resolveUserDisplayName(input: {
  user?: User | null;
  profile?: Pick<UserProfile, "nickname" | "realName" | "email"> | null;
}): string {
  const { user, profile } = input;

  const fromProfile = pickFirstUsableName(profile?.nickname, profile?.realName);
  if (fromProfile) {
    return fromProfile;
  }

  if (user) {
    return getAuthDisplayName(user);
  }

  if (profile?.email && !profile.email.endsWith("@wadeal.local")) {
    const localPart = profile.email.split("@")[0];
    if (isUsableDisplayName(localPart)) {
      return localPart;
    }
  }

  return "회원";
}

export function buildHeaderUserInfo(
  user: User,
  profile: Pick<UserProfile, "nickname" | "realName" | "email" | "memberGrade"> | null,
): HeaderUserInfo {
  const displayName = resolveUserDisplayName({ user, profile });
  const provider = getAuthProviderLabel(user);

  let identityLine = "일반 회원";
  if (profile?.email && !profile.email.endsWith("@wadeal.local")) {
    identityLine = profile.email;
  } else if (provider) {
    identityLine = `${provider} 로그인`;
  } else if (user.email && !user.email.endsWith("@wadeal.local")) {
    identityLine = user.email;
  }

  return {
    displayName,
    identityLine,
    memberGrade: profile?.memberGrade ?? "일반",
  };
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

  const provider = getAuthProviderLabel(user);
  if (provider) {
    return `${provider} 연동 계정`;
  }

  return "로그인됨";
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
