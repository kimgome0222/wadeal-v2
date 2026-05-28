"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { syncAuthUserToPublicProfile } from "@/lib/auth/sync-user-profile";
import { recordRecentViewForUser } from "@/lib/data/recent-views";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function ensureProfile(user: NonNullable<Awaited<ReturnType<typeof getServerAuthUser>>>) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  await syncAuthUserToPublicProfile(user, supabase);
}

export async function recordRecentViewAction(productSlug: string) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensureProfile(user);

  const result = await recordRecentViewForUser(user.id, productSlug);

  if (result.success) {
    revalidatePath("/mypage/recent");
  }

  return result;
}
