import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type AdminNotificationItem = {
  id: string;
  title: string;
  message: string;
  linkUrl: string | null;
  createdAt: string;
};

export async function getAdminNotifications(limit = 100): Promise<AdminNotificationItem[]> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, message, link_url, created_at")
    .eq("role_target", "admin")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[admin-notifications] getAdminNotifications:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    linkUrl: row.link_url,
    createdAt: row.created_at,
  }));
}
