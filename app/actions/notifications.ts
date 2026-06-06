"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "@/lib/notifications";

export async function markNotificationAsReadAction(notificationId: string) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  const result = await markNotificationAsRead(notificationId);
  if (!result.success) {
    return { success: false, error: result.error ?? ("save_failed" as const) };
  }

  revalidatePath("/notifications");
  revalidatePath("/seller/notifications");
  revalidatePath("/admin/notifications");
  revalidatePath("/mypage");

  return { success: true };
}

export async function getUnreadNotificationCountAction(): Promise<number> {
  const user = await getServerAuthUser();
  if (!user) {
    return 0;
  }

  return getUnreadNotificationCount(user.id);
}
