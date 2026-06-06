import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  isMissingColumnError,
  isMissingTableError,
} from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import {
  isNotificationTargetRole,
  isNotificationType,
  type NotificationTargetRole,
  type NotificationType,
} from "@/lib/notifications/types";
import type { SupabaseClient } from "@supabase/supabase-js";

function isMissingRpcError(message: string | undefined): boolean {
  if (!message) {
    return false;
  }

  return (
    message.includes("Could not find the function") ||
    message.includes("PGRST202") ||
    (message.includes("function") && message.includes("does not exist"))
  );
}

export type RoleNotificationResult = {
  success: boolean;
  id?: string;
  error?: "not_configured" | "invalid_input" | "save_failed";
};

async function insertRoleNotificationDirect(
  supabase: SupabaseClient,
  input: {
    targetRole: NotificationTargetRole;
    type: NotificationType;
    title: string;
    message: string;
    linkUrl?: string | null;
    userId?: string | null;
    sellerId?: string | null;
  },
): Promise<RoleNotificationResult> {
  const base = {
    type: input.type,
    title: input.title.trim(),
    message: input.message.trim(),
    link_url: input.linkUrl?.trim() || null,
    channel: "in_app",
  };

  const fullRow = {
    ...base,
    target_role: input.targetRole,
    user_id: input.targetRole === "user" ? input.userId : null,
    seller_id: input.targetRole === "seller" ? input.sellerId : null,
  };

  let result = await supabase.from("notifications").insert(fullRow).select("id").single();

  if (
    result.error &&
    isMissingColumnError(result.error.message) &&
    input.targetRole === "user" &&
    input.userId
  ) {
    result = await supabase
      .from("notifications")
      .insert({ ...base, user_id: input.userId })
      .select("id")
      .single();
  }

  if (result.error || !result.data) {
    if (
      result.error &&
      !isMissingTableError(result.error.message) &&
      !isMissingColumnError(result.error.message) &&
      process.env.NODE_ENV === "development"
    ) {
      console.error("[notifications] insertRoleNotificationDirect:", result.error.message);
    }
    return { success: false, error: "save_failed" };
  }

  return { success: true, id: (result.data as { id: string }).id };
}

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
    return { success: false, error: "not_configured" };
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
    if (isMissingTableError(error.message)) {
      return { success: false, error: "not_configured" };
    }

    if (isMissingRpcError(error.message) || isMissingColumnError(error.message)) {
      return insertRoleNotificationDirect(supabase, input);
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[notifications] insertRoleNotification:", error.message);
    }
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

  let { count, error } = await query;
  if (error && isMissingColumnError(error.message) && role === "user" && context.userId) {
    const legacy = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId)
      .is("read_at", null);
    count = legacy.count;
    error = legacy.error;
  }

  if (error) {
    if (!isMissingTableError(error.message) && !isMissingColumnError(error.message)) {
      console.error("[notifications] getUnreadCountByRole:", error.message);
    }
    return 0;
  }

  return count ?? 0;
}
