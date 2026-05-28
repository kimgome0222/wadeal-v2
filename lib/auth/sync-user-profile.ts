import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getAuthDisplayName, isUuidLike } from "@/lib/auth/user-display";
import type { Database, UserRole } from "@/lib/database/types";

function extractKakaoId(user: User): string | null {
  const kakaoIdentity = user.identities?.find(
    (identity) => identity.provider === "kakao",
  );

  if (kakaoIdentity?.id) {
    return String(kakaoIdentity.id);
  }

  const sub = user.user_metadata?.sub;
  if (typeof sub === "string" && sub) {
    return sub;
  }

  return null;
}

export async function syncAuthUserToPublicProfile(
  user: User,
  supabase: SupabaseClient<Database>,
): Promise<void> {
  const kakaoId = extractKakaoId(user);

  const { data: existing } = await supabase
    .from("users")
    .select("role, nickname")
    .eq("id", user.id)
    .maybeSingle();

  const existingNickname = (existing as { nickname?: string | null } | null)?.nickname ?? null;
  const authDisplayName = getAuthDisplayName(user);
  const shouldRefreshNickname =
    !existingNickname ||
    isUuidLike(existingNickname) ||
    existingNickname.trim().length < 2;

  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      nickname: shouldRefreshNickname ? authDisplayName : existingNickname,
      kakao_id: kakaoId,
      referral_code: null,
      role: ((existing as { role?: UserRole } | null)?.role ?? "user") as UserRole,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[auth] syncAuthUserToPublicProfile:", error.message);
  }
}
