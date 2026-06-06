import type { NotificationCardItem } from "@/components/notification-card";
import { isNotificationType } from "@/lib/notifications/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingColumnError, isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUnreadCountByRole } from "@/lib/notifications/unified";

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) {
    return "방금 전";
  }
  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "어제";
  }

  return `${days}일 전`;
}

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  link_url: string | null;
  read_at: string | null;
  created_at: string;
};

function mapNotificationRow(row: NotificationRow): NotificationCardItem {
  return {
    id: row.id,
    type: isNotificationType(row.type) ? row.type : "new_seller_application",
    title: row.title,
    body: row.message,
    time: formatRelativeTime(row.created_at),
    linkUrl: row.link_url,
    readAt: row.read_at,
  };
}

export async function getAdminNotifications(
  filter: "all" | "unread" = "all",
  limit = 100,
): Promise<NotificationCardItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("notifications")
    .select("id, type, title, message, link_url, read_at, created_at")
    .eq("target_role", "admin")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filter === "unread") {
    query = query.is("read_at", null);
  }

  const { data, error } = await query;

  if (error) {
    if (!isMissingTableError(error.message) && !isMissingColumnError(error.message)) {
      console.error("[admin-notifications] getAdminNotifications:", error.message);
    }
    return [];
  }

  return (data ?? []).map((row) => mapNotificationRow(row as NotificationRow));
}

export async function getUnreadCountForAdmin(): Promise<number> {
  return getUnreadCountByRole("admin", {});
}
