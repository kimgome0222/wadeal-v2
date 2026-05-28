import type { Json } from "@/lib/database/types";
import type { ErrorLogRow } from "@/lib/database/types";
import {
  ERROR_LEVELS,
  ERROR_SOURCES,
  getErrorLevelLabel,
  getErrorSourceLabel,
  type ErrorLevel,
  type ErrorSource,
} from "@/lib/monitoring/error-log-shared";
export type {
  AdminErrorLogFilters,
  AdminErrorLogListItem,
  AdminErrorLogListResult,
} from "@/lib/data/admin-error-logs-shared";
export { getErrorLogRelatedHref } from "@/lib/data/admin-error-logs-shared";
import type {
  AdminErrorLogFilters,
  AdminErrorLogListItem,
  AdminErrorLogListResult,
} from "@/lib/data/admin-error-logs-shared";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminErrorLogSummary = {
  unresolvedCriticalCount: number;
  errorsLast24h: number;
  criticalLast24h: number;
  warningLast24h: number;
};

const LOG_SELECT =
  "id, level, source, message, stack, user_id, order_id, payment_id, deal_id, product_id, metadata, resolved_at, created_at";

const DEFAULT_PAGE_SIZE = 30;

const mockErrorLogs: AdminErrorLogListItem[] = [
  {
    id: "mock-error-1",
    level: "critical",
    levelLabel: getErrorLevelLabel("critical"),
    source: "webhook",
    sourceLabel: getErrorSourceLabel("webhook"),
    message: "Webhook handler failed: payment_not_found",
    messagePreview: "Webhook handler failed: payment_not_found",
    stack: null,
    userId: null,
    orderId: null,
    paymentId: null,
    dealId: null,
    productId: null,
    metadata: { reason: "payment_not_found" },
    resolvedAt: null,
    resolvedAtLabel: null,
    isResolved: false,
    createdAt: new Date().toISOString(),
    createdAtLabel: "방금",
  },
];

function formatTimestamp(isoDate: string): string {
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

function truncateMessage(message: string, max = 80): string {
  if (message.length <= max) {
    return message;
  }

  return `${message.slice(0, max)}…`;
}

function mapLogRow(row: ErrorLogRow): AdminErrorLogListItem {
  const level = row.level as ErrorLevel;
  const source = row.source as ErrorSource;
  const resolvedAt = row.resolved_at;

  return {
    id: row.id,
    level,
    levelLabel: getErrorLevelLabel(level),
    source,
    sourceLabel: getErrorSourceLabel(source),
    message: row.message,
    messagePreview: truncateMessage(row.message),
    stack: row.stack,
    userId: row.user_id,
    orderId: row.order_id,
    paymentId: row.payment_id,
    dealId: row.deal_id,
    productId: row.product_id,
    metadata: row.metadata,
    resolvedAt,
    resolvedAtLabel: resolvedAt ? formatTimestamp(resolvedAt) : null,
    isResolved: Boolean(resolvedAt),
    createdAt: row.created_at,
    createdAtLabel: formatTimestamp(row.created_at),
  };
}

export function parseAdminErrorLogFilters(
  params: Record<string, string | undefined>,
): AdminErrorLogFilters {
  const level = params.level;
  const source = params.source;
  const resolved = params.resolved;

  return {
    level: ERROR_LEVELS.includes(level as ErrorLevel) ? (level as ErrorLevel) : undefined,
    source: ERROR_SOURCES.includes(source as ErrorSource) ? (source as ErrorSource) : undefined,
    resolved:
      resolved === "open" || resolved === "resolved" || resolved === "all" ? resolved : "open",
    page: Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
  };
}

export async function getAdminErrorLogs(
  filters: AdminErrorLogFilters = {},
): Promise<AdminErrorLogListResult> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      const logs = mockErrorLogs;
      return {
        logs,
        totalCount: logs.length,
        page: 1,
        pageSize,
        totalPages: 1,
      };
    }

    return { logs: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { logs: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }

  let query = supabase
    .from("error_logs")
    .select(LOG_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.level) {
    query = query.eq("level", filters.level);
  }

  if (filters.source) {
    query = query.eq("source", filters.source);
  }

  const resolvedFilter = filters.resolved ?? "open";
  if (resolvedFilter === "open") {
    query = query.is("resolved_at", null);
  } else if (resolvedFilter === "resolved") {
    query = query.not("resolved_at", "is", null);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("[admin-error-logs] getAdminErrorLogs:", error.message);
    return { logs: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }

  const totalCount = count ?? 0;
  const logs = (data ?? []).map((row) => mapLogRow(row as ErrorLogRow));

  return {
    logs,
    totalCount,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  };
}

export async function getAdminErrorLogById(logId: string): Promise<AdminErrorLogListItem | null> {
  if (!isSupabaseConfigured()) {
    return mockErrorLogs.find((log) => log.id === logId) ?? null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("error_logs")
    .select(LOG_SELECT)
    .eq("id", logId)
    .maybeSingle();

  if (error || !data) {
    console.error("[admin-error-logs] getAdminErrorLogById:", error?.message);
    return null;
  }

  return mapLogRow(data as ErrorLogRow);
}

export async function getAdminErrorLogSummary(): Promise<AdminErrorLogSummary> {
  const empty: AdminErrorLogSummary = {
    unresolvedCriticalCount: 0,
    errorsLast24h: 0,
    criticalLast24h: 0,
    warningLast24h: 0,
  };

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      return {
        unresolvedCriticalCount: 1,
        errorsLast24h: 2,
        criticalLast24h: 1,
        warningLast24h: 1,
      };
    }

    return empty;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return empty;
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [criticalOpen, errors24h, critical24h, warnings24h] = await Promise.all([
    supabase
      .from("error_logs")
      .select("id", { count: "exact", head: true })
      .eq("level", "critical")
      .is("resolved_at", null),
    supabase
      .from("error_logs")
      .select("id", { count: "exact", head: true })
      .in("level", ["error", "critical"])
      .gte("created_at", since),
    supabase
      .from("error_logs")
      .select("id", { count: "exact", head: true })
      .eq("level", "critical")
      .gte("created_at", since),
    supabase
      .from("error_logs")
      .select("id", { count: "exact", head: true })
      .eq("level", "warning")
      .gte("created_at", since),
  ]);

  return {
    unresolvedCriticalCount: criticalOpen.count ?? 0,
    errorsLast24h: errors24h.count ?? 0,
    criticalLast24h: critical24h.count ?? 0,
    warningLast24h: warnings24h.count ?? 0,
  };
}
