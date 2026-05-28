import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { KakaoProfile } from "@/lib/auth/kakao-oauth-server";
import { getKakaoAuthEmail } from "@/lib/auth/kakao-oauth-server";

function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

export async function ensureKakaoSupabaseUser(profile: KakaoProfile) {
  const env = getSupabaseEnv();
  const serviceRoleKey = getServiceRoleKey();

  if (!env || !serviceRoleKey) {
    throw new Error("Supabase service role credentials are not configured.");
  }

  const admin = createClient(env.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const email = getKakaoAuthEmail(profile.id);

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      kakao_id: profile.id,
      full_name: profile.nickname,
      avatar_url: profile.profileImageUrl,
      provider: "kakao",
    },
  });

  if (
    createError &&
    !createError.message.toLowerCase().includes("already") &&
    createError.message !== "User already registered"
  ) {
    throw createError;
  }

  const { data: linkData, error: linkError } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

  if (linkError || !linkData.properties?.hashed_token) {
    throw linkError ?? new Error("Failed to create Supabase login link.");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase server client is not configured.");
  }

  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: linkData.properties.hashed_token,
  });

  if (verifyError) {
    throw verifyError;
  }
}
