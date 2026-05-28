import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingColumnError, isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createUserNotification, getUnreadCountByRole } from "@/lib/notifications/unified";
import {
  isNotificationType,
  type NotificationChannel,
  type NotificationType,
} from "@/lib/notifications/types";

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string | null;
  channel?: NotificationChannel;
};

export type CreateNotificationResult = {
  success: boolean;
  id?: string;
  error?: "not_configured" | "invalid_input" | "save_failed";
};

export type MarkNotificationReadResult = {
  success: boolean;
  error?: "not_configured" | "not_found" | "save_failed";
};

const DEDUPE_WINDOW_MS = 60 * 60 * 1000;

async function hasRecentDuplicate(
  userId: string,
  type: NotificationType,
  linkUrl: string | null,
): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return false;
  }

  const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
  let query = supabase
    .from("notifications")
    .select("id")
    .eq("target_role", "user")
    .eq("user_id", userId)
    .eq("type", type)
    .gte("created_at", since)
    .limit(1);

  if (linkUrl) {
    query = query.eq("link_url", linkUrl);
  }

  const { data, error } = await query;
  if (error) {
    return false;
  }

  return (data?.length ?? 0) > 0;
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  linkUrl?: string | null,
  channel: NotificationChannel = "in_app",
  options?: { skipDuplicateCheck?: boolean },
): Promise<CreateNotificationResult> {
  if (!userId || !isNotificationType(type) || !title.trim() || !message.trim()) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "not_configured" };
  }

  const normalizedLink = linkUrl?.trim() || null;

  if (!options?.skipDuplicateCheck) {
    const duplicate = await hasRecentDuplicate(userId, type, normalizedLink);
    if (duplicate) {
      return { success: true };
    }
  }

  return createUserNotification(userId, type, title, message, normalizedLink);
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<MarkNotificationReadResult> {
  if (!notificationId) {
    return { success: false, error: "not_found" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase.rpc("mark_notification_read", {
    p_notification_id: notificationId,
  });

  if (!error) {
    if (data !== true) {
      return { success: false, error: "not_found" };
    }
    return { success: true };
  }

  const isMissingRpc =
    error.message.includes("Could not find the function") ||
    error.message.includes("PGRST202") ||
    (error.message.includes("function") && error.message.includes("does not exist"));

  if (!isMissingRpc) {
    if (
      !isMissingTableError(error.message) &&
      !isMissingColumnError(error.message) &&
      process.env.NODE_ENV === "development"
    ) {
      console.error("[notifications] markNotificationAsRead:", error.message);
    }
    return { success: false, error: "save_failed" };
  }

  const now = new Date().toISOString();
  const { data: updated, error: updateError } = await supabase
    .from("notifications")
    .update({ read_at: now })
    .eq("id", notificationId)
    .is("read_at", null)
    .select("id")
    .maybeSingle();

  if (updateError) {
    if (
      !isMissingTableError(updateError.message) &&
      !isMissingColumnError(updateError.message) &&
      process.env.NODE_ENV === "development"
    ) {
      console.error("[notifications] markNotificationAsRead direct:", updateError.message);
    }
    return { success: false, error: "save_failed" };
  }

  if (!updated) {
    return { success: false, error: "not_found" };
  }

  return { success: true };
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  if (!userId || !isSupabaseConfigured()) {
    return 0;
  }

  return getUnreadCountByRole("user", { userId });
}

export type NotifyDealParticipantsPayload = {
  title: string;
  message: string;
  linkUrl?: string | null;
  channel?: NotificationChannel;
};

export async function notifyDealParticipants(
  dealId: string,
  type: NotificationType,
  payload: NotifyDealParticipantsPayload,
): Promise<{ success: boolean; count?: number; error?: string }> {
  if (!dealId || !isNotificationType(type)) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, count: 0 };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase.rpc("notify_deal_participants", {
    p_deal_id: dealId,
    p_type: type,
    p_title: payload.title.trim(),
    p_message: payload.message.trim(),
    p_link_url: payload.linkUrl?.trim() || null,
    p_channel: payload.channel ?? "in_app",
  });

  if (error) {
    console.error("[notifications] notifyDealParticipants:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true, count: (data as number) ?? 0 };
}
