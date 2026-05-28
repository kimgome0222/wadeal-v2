"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { upsertNotificationSettingsForUser } from "@/lib/data/notification-settings";
import type { UpdateNotificationSettingsInput } from "@/lib/profile/types";

export async function updateNotificationSettingsAction(input: UpdateNotificationSettingsInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const };
  }

  const result = await upsertNotificationSettingsForUser(user.id, input);

  if (result.success) {
    revalidatePath("/mypage/notification-settings");
    revalidatePath("/mypage/settings");
  }

  return result;
}

export async function getNotificationSettingsAction() {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false as const, error: "login_required" as const, settings: null };
  }

  const { getNotificationSettingsForUser } = await import("@/lib/data/notification-settings");
  const settings = await getNotificationSettingsForUser(user.id);
  return { success: true as const, settings };
}
