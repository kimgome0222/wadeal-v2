"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { syncAuthUserToPublicProfile } from "@/lib/auth/sync-user-profile";
import {
  addToJoinCartForUser,
  removeFromJoinCartForUser,
  updateJoinCartQuantityForUser,
} from "@/lib/data/join-cart";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function ensureProfile(user: NonNullable<Awaited<ReturnType<typeof getServerAuthUser>>>) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  await syncAuthUserToPublicProfile(user, supabase);
}

export async function addToJoinCartAction(productSlug: string, quantity = 1) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensureProfile(user);

  const result = await addToJoinCartForUser(user.id, productSlug, quantity);

  if (result.success) {
    revalidatePath("/join-cart");
    revalidatePath(`/product/${productSlug}`);
  }

  return result;
}

export async function updateJoinCartQuantityAction(cartItemId: string, quantity: number) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  const result = await updateJoinCartQuantityForUser(user.id, cartItemId, quantity);

  if (result.success) {
    revalidatePath("/join-cart");
  }

  return result;
}

export async function removeFromJoinCartAction(cartItemId: string) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  const result = await removeFromJoinCartForUser(user.id, cartItemId);

  if (result.success) {
    revalidatePath("/join-cart");
  }

  return result;
}
