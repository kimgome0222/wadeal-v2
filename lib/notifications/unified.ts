import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import {
  isNotificationTargetRole,
  isNotificationType,
  type NotificationTargetRole,
  type NotificationType,
} from "@/lib/notifications/types";

export type RoleNotificationResult = {
  success: boolean;
  id?: string;
  error?: "not_configured" | "invalid_input" | "save_failed";
};

async function insertRoleNotification(input: {
  targetRole: NotificationTargetRole;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string | null;
  userId?: string | null;
  sellerId?: string | null;
}): Promise<RoleNotificationResult> {
  if (
    !isNotificationTargetRole(input.targetRole) ||
    !isNotificationType(input.type) ||
    !input.title.trim() ||
    !input.message.trim()
  ) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, id: "mock-notification" };
  }

  const supabase = createServiceRoleSupabaseClient() ?? (await createServerSupabaseClient());
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase.rpc("create_role_notification", {
    p_target_role: input.targetRole,
    p_type: input.type,
    p_title: input.title.trim(),
    p_message: input.message.trim(),
    p_link_url: input.linkUrl?.trim() || null,
    p_user_id: input.userId ?? null,
    p_seller_id: input.sellerId ?? null,
    p_channel: "in_app",
  });

  if (error) {
    console.error("[notifications] insertRoleNotification:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true, id: data as string };
}

export async function createUserNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  linkUrl?: string | null,
): Promise<RoleNotificationResult> {
  return insertRoleNotification({
    targetRole: "user",
    type,
    title,
    message,
    linkUrl,
    userId,
  });
}

export async function createSellerNotification(
  sellerId: string,
  type: NotificationType,
  title: string,
  message: string,
  linkUrl?: string | null,
): Promise<RoleNotificationResult> {
  return insertRoleNotification({
    targetRole: "seller",
    type,
    title,
    message,
    linkUrl,
    sellerId,
  });
}

export async function createAdminNotification(
  type: NotificationType,
  title: string,
  message: string,
  linkUrl?: string | null,
): Promise<RoleNotificationResult> {
  return insertRoleNotification({
    targetRole: "admin",
    type,
    title,
    message,
    linkUrl,
  });
}

export async function getUnreadCountByRole(
  role: NotificationTargetRole,
  context: { userId?: string; sellerId?: string },
): Promise<number> {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return 0;
  }

  let query = supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("target_role", role)
    .is("read_at", null);

  if (role === "user" && context.userId) {
    query = query.eq("user_id", context.userId);
  } else if (role === "seller" && context.sellerId) {
    query = query.eq("seller_id", context.sellerId);
  }

  const { count, error } = await query;
  if (error) {
    console.error("[notifications] getUnreadCountByRole:", error.message);
    return 0;
  }

  return count ?? 0;
}
