import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  sanitizeLogData,
  type AdminAction,
  type AdminTargetType,
} from "@/lib/admin/activity-log-shared";

export type CreateAdminActivityLogInput = {
  adminUserId: string;
  action: AdminAction;
  targetType: AdminTargetType;
  targetId: string;
  beforeData?: unknown;
  afterData?: unknown;
  ipHash?: string | null;
  userAgent?: string | null;
};

export async function createAdminActivityLog(
  input: CreateAdminActivityLogInput,
): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.log("[admin-activity-log]", input.action, input.targetType, input.targetId);
    }
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    console.error("[admin-activity-log] Supabase client unavailable");
    return { success: false };
  }

  const userAgent =
    input.userAgent && input.userAgent.length > 512
      ? input.userAgent.slice(0, 512)
      : (input.userAgent ?? null);

  const { error } = await supabase.from("admin_activity_logs" as "orders").insert({
    admin_user_id: input.adminUserId,
    action: input.action,
    target_type: input.targetType,
    target_id: input.targetId,
    before_data: sanitizeLogData(input.beforeData),
    after_data: sanitizeLogData(input.afterData),
    ip_hash: input.ipHash ?? null,
    user_agent: userAgent,
  } as never);

  if (error) {
    console.error("[admin-activity-log] insert failed:", error.message);
    return { success: false };
  }

  return { success: true };
}

export {
  ADMIN_ACTIONS,
  ADMIN_ACTION_LABELS,
  ADMIN_TARGET_TYPES,
  ADMIN_TARGET_TYPE_LABELS,
  getAdminActionLabel,
  getAdminTargetHref,
  getAdminTargetTypeLabel,
  sanitizeLogData,
  type AdminAction,
  type AdminTargetType,
} from "@/lib/admin/activity-log-shared";
