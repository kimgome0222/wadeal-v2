import type { WebhookLogRow } from "@/lib/database/types";
import { formatOrderDate } from "@/lib/orders/admin-order-status";
import { getPaymentStatusLabel } from "@/lib/orders/admin-order-status";
import { normalizePaymentRecordStatus } from "@/lib/payments/payment-status";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminWebhookLogItem = {
  id: string;
  provider: string;
  eventType: string;
  eventId: string | null;
  paymentKey: string | null;
  orderId: string | null;
  status: string;
  statusLabel: string;
  errorMessage: string | null;
  processedAt: string | null;
  processedAtLabel: string | null;
  createdAt: string;
  createdAtLabel: string;
};

export type AdminPaymentLogItem = {
  id: string;
  orderId: string;
  status: string;
  statusLabel: string;
  paymentKey: string | null;
  method: string | null;
  requestedAmount: number;
  confirmedAmount: number | null;
  approvedAtLabel: string | null;
  createdAtLabel: string;
};

const WEBHOOK_STATUS_LABELS: Record<string, string> = {
  pending: "대기",
  processed: "처리됨",
  skipped: "건너뜀",
  failed: "실패",
};

function mapWebhookLog(row: WebhookLogRow): AdminWebhookLogItem {
  return {
    id: row.id,
    provider: row.provider,
    eventType: row.event_type,
    eventId: row.event_id,
    paymentKey: row.payment_key,
    orderId: row.order_id,
    status: row.status,
    statusLabel: WEBHOOK_STATUS_LABELS[row.status] ?? row.status,
    errorMessage: row.error_message,
    processedAt: row.processed_at,
    processedAtLabel: row.processed_at ? formatOrderDate(row.processed_at) : null,
    createdAt: row.created_at,
    createdAtLabel: formatOrderDate(row.created_at),
  };
}

export async function getAdminWebhookLogs(limit = 50): Promise<AdminWebhookLogItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("webhook_logs")
    .select(
      "id, provider, event_type, event_id, payment_key, order_id, status, error_message, processed_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[data] getAdminWebhookLogs:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapWebhookLog(row as WebhookLogRow));
}

export async function getAdminRecentPayments(limit = 30): Promise<AdminPaymentLogItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("payments")
    .select(
      "id, order_id, status, payment_key, method, requested_amount, confirmed_amount, approved_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[data] getAdminRecentPayments:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const status = normalizePaymentRecordStatus(row.status as string);
    return {
      id: row.id as string,
      orderId: row.order_id as string,
      status,
      statusLabel: getPaymentStatusLabel(status),
      paymentKey: (row.payment_key as string | null) ?? null,
      method: (row.method as string | null) ?? null,
      requestedAmount: row.requested_amount as number,
      confirmedAmount: (row.confirmed_amount as number | null) ?? null,
      approvedAtLabel:
        row.approved_at ? formatOrderDate(row.approved_at as string) : null,
      createdAtLabel: formatOrderDate(row.created_at as string),
    };
  });
}
