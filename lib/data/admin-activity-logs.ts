import type { Json } from "@/lib/database/types";
import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
  getAdminActionLabel,
  getAdminTargetTypeLabel,
  type AdminAction,
  type AdminTargetType,
} from "@/lib/admin/activity-log-shared";
export type {
  AdminActivityLogAdminOption,
  AdminActivityLogFilters,
  AdminActivityLogListItem,
  AdminActivityLogListResult,
} from "@/lib/data/admin-activity-logs-shared";
import type {
  AdminActivityLogAdminOption,
  AdminActivityLogFilters,
  AdminActivityLogListItem,
  AdminActivityLogListResult,
} from "@/lib/data/admin-activity-logs-shared";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const LOG_SELECT =
  "id, admin_user_id, action, target_type, target_id, before_data, after_data, ip_hash, user_agent, created_at";

const DEFAULT_PAGE_SIZE = 30;

const mockAdminActivityLogs: AdminActivityLogListItem[] = [
  {
    id: "mock-log-1",
    adminUserId: "00000000-0000-4000-8000-000000000001",
    adminName: "관리자",
    adminEmail: "admin@wadeal.test",
    action: ADMIN_ACTIONS.PRODUCT_APPROVE,
    actionLabel: getAdminActionLabel(ADMIN_ACTIONS.PRODUCT_APPROVE),
    targetType: ADMIN_TARGET_TYPES.PRODUCT,
    targetTypeLabel: getAdminTargetTypeLabel(ADMIN_TARGET_TYPES.PRODUCT),
    targetId: "mock-product-1",
    beforeData: { approval_status: "pending_review" },
    afterData: { approval_status: "approved" },
    ipHash: null,
    userAgent: "MockAgent/1.0",
    createdAt: "2026-05-28T09:00:00.000Z",
    createdAtLabel: "2026-05-28 18:00",
  },
];

function formatLogTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

function mapLogRow(
  row: Record<string, unknown>,
  adminProfiles: Map<string, { nickname: string | null; email: string | null }>,
): AdminActivityLogListItem {
  const adminUserId = row.admin_user_id as string;
  const profile = adminProfiles.get(adminUserId);
  const action = row.action as AdminAction;
  const targetType = row.target_type as AdminTargetType;

  return {
    id: row.id as string,
    adminUserId,
    adminName: profile?.nickname?.trim() || profile?.email?.split("@")[0] || "관리자",
    adminEmail: profile?.email ?? null,
    action,
    actionLabel: getAdminActionLabel(action),
    targetType,
    targetTypeLabel: getAdminTargetTypeLabel(targetType),
    targetId: row.target_id as string,
    beforeData: (row.before_data as Json | null) ?? null,
    afterData: (row.after_data as Json | null) ?? null,
    ipHash: (row.ip_hash as string | null) ?? null,
    userAgent: (row.user_agent as string | null) ?? null,
    createdAt: row.created_at as string,
    createdAtLabel: formatLogTimestamp(row.created_at as string),
  };
}

async function loadAdminProfiles(
  adminUserIds: string[],
): Promise<Map<string, { nickname: string | null; email: string | null }>> {
  const profiles = new Map<string, { nickname: string | null; email: string | null }>();

  if (adminUserIds.length === 0 || !isSupabaseConfigured()) {
    return profiles;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return profiles;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, email")
    .in("id", adminUserIds);

  if (error) {
    console.error("[admin-activity-logs] loadAdminProfiles:", error.message);
    return profiles;
  }

  for (const row of data ?? []) {
    profiles.set(row.id as string, {
      nickname: (row.nickname as string | null) ?? null,
      email: (row.email as string | null) ?? null,
    });
  }

  return profiles;
}

export function parseAdminActivityLogFilters(
  params: Record<string, string | undefined>,
): AdminActivityLogFilters {
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const actionValues = new Set(Object.values(ADMIN_ACTIONS));
  const targetTypeValues = new Set(Object.values(ADMIN_TARGET_TYPES));

  return {
    adminId: params.admin_id?.trim() || undefined,
    action: actionValues.has(params.action as AdminAction)
      ? (params.action as AdminAction)
      : undefined,
    targetType: targetTypeValues.has(params.target_type as AdminTargetType)
      ? (params.target_type as AdminTargetType)
      : undefined,
    from: params.from?.trim() || undefined,
    to: params.to?.trim() || undefined,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

export async function getAdminActivityLogs(
  filters: AdminActivityLogFilters = {},
): Promise<AdminActivityLogListResult> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) {
      return { logs: [], totalCount: 0, page, pageSize, totalPages: 0 };
    }

    let logs = [...mockAdminActivityLogs];
    if (filters.action) {
      logs = logs.filter((log) => log.action === filters.action);
    }
    if (filters.targetType) {
      logs = logs.filter((log) => log.targetType === filters.targetType);
    }
    if (filters.adminId) {
      logs = logs.filter((log) => log.adminUserId === filters.adminId);
    }

    return {
      logs,
      totalCount: logs.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(logs.length / pageSize)),
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { logs: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }

  let query = supabase
    .from("admin_activity_logs")
    .select(LOG_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.adminId) {
    query = query.eq("admin_user_id", filters.adminId);
  }
  if (filters.action) {
    query = query.eq("action", filters.action);
  }
  if (filters.targetType) {
    query = query.eq("target_type", filters.targetType);
  }
  if (filters.from) {
    query = query.gte("created_at", `${filters.from}T00:00:00.000Z`);
  }
  if (filters.to) {
    query = query.lte("created_at", `${filters.to}T23:59:59.999Z`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("[admin-activity-logs] getAdminActivityLogs:", error.message);
    return { logs: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  const adminUserIds = [...new Set(rows.map((row) => String(row.admin_user_id)))];
  const adminProfiles = await loadAdminProfiles(adminUserIds);
  const logs = rows.map((row) => mapLogRow(row, adminProfiles));
  const totalCount = count ?? logs.length;

  return {
    logs,
    totalCount,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  };
}

export async function getAdminActivityLogById(
  logId: string,
): Promise<AdminActivityLogListItem | null> {
  if (!isSupabaseConfigured()) {
    return mockAdminActivityLogs.find((log) => log.id === logId) ?? null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("admin_activity_logs")
    .select(LOG_SELECT)
    .eq("id", logId)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("[admin-activity-logs] getAdminActivityLogById:", error.message);
    }
    return null;
  }

  const row = data as Record<string, unknown>;
  const adminProfiles = await loadAdminProfiles([row.admin_user_id as string]);
  return mapLogRow(row, adminProfiles);
}

export async function getAdminActivityLogAdminOptions(): Promise<AdminActivityLogAdminOption[]> {
  if (!isSupabaseConfigured()) {
    return [{ id: "00000000-0000-4000-8000-000000000001", label: "관리자" }];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data: logAdmins, error: logError } = await supabase
    .from("admin_activity_logs")
    .select("admin_user_id")
    .order("created_at", { ascending: false })
    .limit(500);

  if (logError) {
    console.error("[admin-activity-logs] getAdminActivityLogAdminOptions:", logError.message);
    return [];
  }

  const adminIds = [
    ...new Set(
      (logAdmins ?? []).map((row) => (row as { admin_user_id: string }).admin_user_id),
    ),
  ];
  if (adminIds.length === 0) {
    return [];
  }

  const profiles = await loadAdminProfiles(adminIds);

  return adminIds.map((id) => {
    const profile = profiles.get(id);
    const label = profile?.nickname?.trim() || profile?.email || id.slice(0, 8);
    return { id, label };
  });
}

export {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
  getAdminActionLabel,
  getAdminTargetHref,
  getAdminTargetTypeLabel,
} from "@/lib/admin/activity-log-shared";
