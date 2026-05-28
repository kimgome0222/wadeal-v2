import type { Json, PaymentRow } from "@/lib/database/types";
import {
  formatOrderDate,
  getPaymentStatusLabel,
} from "@/lib/orders/admin-order-status";
import {
  normalizePaymentRecordStatus,
} from "@/lib/payments/payment-status";
import type { OrderPaymentInfo } from "@/lib/payments/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[payments-data] using mock fallback: ${context}`);
  }
}

export type { OrderPaymentInfo } from "@/lib/payments/types";

const mockPayments = new Map<string, OrderPaymentInfo>([
  [
    "mock-admin-order-1",
    {
      id: "mock-payment-1",
      orderId: "mock-admin-order-1",
      status: "ready",
      statusLabel: getPaymentStatusLabel("ready"),
      requestedAmount: 12900,
      confirmedAmount: null,
      joinedEstimateAmount: 12900,
      amountDelta: null,
      method: null,
      paymentFlow: null,
      autoChargeAttemptedAt: null,
      paymentProvider: null,
      paymentKey: null,
      approvedAt: null,
      approvedAtLabel: null,
      failedAt: null,
      failedAtLabel: null,
      cancelledAt: null,
      cancelledAtLabel: null,
      createdAt: "2026-05-20T10:00:00.000Z",
    },
  ],
  [
    "mock-admin-order-2",
    {
      id: "mock-payment-2",
      orderId: "mock-admin-order-2",
      status: "paid",
      statusLabel: getPaymentStatusLabel("paid"),
      requestedAmount: 149800,
      confirmedAmount: 149800,
      joinedEstimateAmount: 159800,
      amountDelta: -10000,
      method: "card",
      paymentFlow: null,
      autoChargeAttemptedAt: null,
      paymentProvider: "toss",
      paymentKey: "mock-key-2",
      approvedAt: "2026-05-16T10:00:00.000Z",
      approvedAtLabel: formatOrderDate("2026-05-16T10:00:00.000Z"),
      failedAt: null,
      failedAtLabel: null,
      cancelledAt: null,
      cancelledAtLabel: null,
      createdAt: "2026-05-15T10:00:00.000Z",
    },
  ],
  [
    "mock-admin-order-3",
    {
      id: "mock-payment-3",
      orderId: "mock-admin-order-3",
      status: "paid",
      statusLabel: getPaymentStatusLabel("paid"),
      requestedAmount: 84900,
      confirmedAmount: 84900,
      joinedEstimateAmount: 89000,
      amountDelta: -4100,
      method: "card",
      paymentFlow: null,
      autoChargeAttemptedAt: null,
      paymentProvider: "toss",
      paymentKey: "mock-key-3",
      approvedAt: "2026-05-11T10:00:00.000Z",
      approvedAtLabel: formatOrderDate("2026-05-11T10:00:00.000Z"),
      failedAt: null,
      failedAtLabel: null,
      cancelledAt: null,
      cancelledAtLabel: null,
      createdAt: "2026-05-10T10:00:00.000Z",
    },
  ],
]);

function formatOptionalDate(iso: string | null): string | null {
  if (!iso) {
    return null;
  }

  return formatOrderDate(iso);
}

function mapPaymentRow(
  row: PaymentRow,
  joinedEstimateAmount?: number | null,
): OrderPaymentInfo {
  const status = normalizePaymentRecordStatus(row.status);
  const requestedAmount = row.requested_amount;
  const confirmedAmount = row.confirmed_amount;
  const amountDelta =
    joinedEstimateAmount != null ? requestedAmount - joinedEstimateAmount : null;

  return {
    id: row.id,
    orderId: row.order_id,
    status,
    statusLabel: getPaymentStatusLabel(status),
    requestedAmount,
    confirmedAmount,
    joinedEstimateAmount: joinedEstimateAmount ?? null,
    amountDelta,
    method: row.method,
    paymentFlow: row.payment_flow ?? null,
    autoChargeAttemptedAt: row.auto_charge_attempted_at ?? null,
    paymentProvider: row.payment_provider,
    paymentKey: row.payment_key,
    approvedAt: row.approved_at,
    approvedAtLabel: formatOptionalDate(row.approved_at),
    failedAt: row.failed_at,
    failedAtLabel: formatOptionalDate(row.failed_at),
    cancelledAt: row.cancelled_at,
    cancelledAtLabel: formatOptionalDate(row.cancelled_at),
    createdAt: row.created_at,
  };
}

const PAYMENT_SELECT =
  "id, order_id, user_id, deal_id, product_id, payment_provider, payment_key, amount, requested_amount, confirmed_amount, status, method, payment_flow, auto_charge_attempted_at, approved_at, failed_at, cancelled_at, raw_response, created_at, updated_at";

export async function getPaymentByOrderId(
  orderId: string,
  joinedEstimateAmount?: number | null,
): Promise<OrderPaymentInfo | null> {
  if (orderId.startsWith("mock-admin-order-")) {
    return mockPayments.get(orderId) ?? null;
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getPaymentByOrderId");
      return mockPayments.get(orderId) ?? null;
    }
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return shouldUseMockData() ? (mockPayments.get(orderId) ?? null) : null;
  }

  const { data, error } = await supabase
    .from("payments")
    .select(PAYMENT_SELECT)
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) {
    console.error("[data] getPaymentByOrderId:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapPaymentRow(data as PaymentRow, joinedEstimateAmount);
}

export async function getPaymentById(paymentId: string): Promise<OrderPaymentInfo | null> {
  if (paymentId.startsWith("mock-payment-")) {
    for (const payment of mockPayments.values()) {
      if (payment.id === paymentId) {
        return payment;
      }
    }
    return null;
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      for (const payment of mockPayments.values()) {
        if (payment.id === paymentId) {
          return payment;
        }
      }
    }
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("payments")
    .select(PAYMENT_SELECT)
    .eq("id", paymentId)
    .maybeSingle();

  if (error) {
    console.error("[data] getPaymentById:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapPaymentRow(data as PaymentRow, null);
}

export async function getPaymentsByOrderIds(
  orderIds: string[],
  joinedAmountsByOrderId?: Map<string, number>,
): Promise<Map<string, OrderPaymentInfo>> {
  const result = new Map<string, OrderPaymentInfo>();

  if (orderIds.length === 0) {
    return result;
  }

  const mockIds = orderIds.filter((id) => id.startsWith("mock-admin-order-"));
  for (const id of mockIds) {
    const payment = mockPayments.get(id);
    if (payment) {
      result.set(id, payment);
    }
  }

  const realIds = orderIds.filter((id) => !id.startsWith("mock-admin-order-"));
  if (realIds.length === 0) {
    return result;
  }

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getPaymentsByOrderIds");
    }
    return result;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return result;
  }

  const { data, error } = await supabase
    .from("payments")
    .select(PAYMENT_SELECT)
    .in("order_id", realIds);

  if (error) {
    console.error("[data] getPaymentsByOrderIds:", error.message);
    return result;
  }

  for (const row of data ?? []) {
    const paymentRow = row as PaymentRow;
    const joinedEstimate = joinedAmountsByOrderId?.get(paymentRow.order_id) ?? null;
    result.set(paymentRow.order_id, mapPaymentRow(paymentRow, joinedEstimate));
  }

  return result;
}

export type { Json };
