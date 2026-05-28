import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
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
    return { success: true, id: "mock-notification" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const normalizedLink = linkUrl?.trim() || null;

  if (!options?.skipDuplicateCheck) {
    const duplicate = await hasRecentDuplicate(userId, type, normalizedLink);
    if (duplicate) {
      return { success: true };
    }
  }

  const { data, error } = await supabase.rpc("create_notification", {
    p_user_id: userId,
    p_type: type,
    p_title: title.trim(),
    p_message: message.trim(),
    p_link_url: normalizedLink,
    p_channel: channel,
  });

  if (error) {
    console.error("[notifications] createNotification:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true, id: data as string };
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

  if (error) {
    console.error("[notifications] markNotificationAsRead:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (data !== true) {
    return { success: false, error: "not_found" };
  }

  return { success: true };
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  if (!userId) {
    return 0;
  }

  if (!isSupabaseConfigured()) {
    return 0;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    console.error("[notifications] getUnreadNotificationCount:", error.message);
    return 0;
  }

  return count ?? 0;
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
