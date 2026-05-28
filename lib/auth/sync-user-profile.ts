import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getAuthDisplayName } from "@/lib/auth/user-display";
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
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      nickname: getAuthDisplayName(user),
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
