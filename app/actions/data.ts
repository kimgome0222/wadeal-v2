"use server";

import { revalidatePath } from "next/cache";

import {
  getAuthDisplayName,
  getServerAuthUser,
} from "@/lib/auth/server-session";
import { createParticipation } from "@/lib/data/deals";
import { createPriceAlert } from "@/lib/data/price-alerts";
import type {
  CreateParticipationInput,
  CreatePriceAlertInput,
} from "@/lib/database/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function ensurePublicUserProfile(userId: string, email: string | null, nickname: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("users").upsert(
    {
      id: userId,
      email,
      nickname,
      kakao_id: null,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[actions] ensurePublicUserProfile:", error.message);
  }
}

export async function submitPriceAlertAction(input: CreatePriceAlertInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensurePublicUserProfile(
    user.id,
    user.email ?? null,
    getAuthDisplayName(user),
  );

  const result = await createPriceAlert({
    ...input,
    userId: user.id,
  });

  if (result.success) {
    revalidatePath("/mypage/alerts");
  }

  return result;
}

export async function submitParticipationAction(input: CreateParticipationInput) {
  return createParticipation(input);
}
