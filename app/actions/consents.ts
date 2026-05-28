"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import type { SaveUserConsentsInput } from "@/lib/consents/types";
import { hasRequiredConsents, saveUserConsents } from "@/lib/data/user-consents";

export async function saveUserConsentsAction(input: SaveUserConsentsInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const result = await saveUserConsents(user.id, input);
  if (!result.success) {
    return { success: false as const, error: "save_failed" as const };
  }

  revalidatePath("/checkout");
  revalidatePath("/join");
  revalidatePath("/login");
  revalidatePath("/mypage");

  return { success: true as const };
}

export async function checkRequiredConsentsAction() {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const agreed = await hasRequiredConsents(user.id);
  return { success: true as const, hasRequiredConsents: agreed };
}
