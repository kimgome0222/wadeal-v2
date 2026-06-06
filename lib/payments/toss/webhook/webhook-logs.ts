import type { Json, PaymentRow, WebhookLogRow } from "@/lib/database/types";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type WebhookLogStatus = "pending" | "processed" | "skipped" | "failed";

export type InsertWebhookLogInput = {
  provider?: string;
  eventType: string;
  eventId?: string | null;
  paymentKey?: string | null;
  orderId?: string | null;
  rawPayload: Json;
};

export type WebhookLogRecord = {
  id: string;
  provider: string;
  eventType: string;
  eventId: string | null;
  paymentKey: string | null;
  orderId: string | null;
  status: WebhookLogStatus;
  errorMessage: string | null;
  processedAt: string | null;
  createdAt: string;
};

function mapWebhookLogRow(row: WebhookLogRow): WebhookLogRecord {
  return {
    id: row.id,
    provider: row.provider,
    eventType: row.event_type,
    eventId: row.event_id,
    paymentKey: row.payment_key,
    orderId: row.order_id,
    status: row.status as WebhookLogStatus,
    errorMessage: row.error_message,
    processedAt: row.processed_at,
    createdAt: row.created_at,
  };
}

export async function insertWebhookLog(
  input: InsertWebhookLogInput,
): Promise<{ id: string } | null> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("webhook_logs")
    .insert({
      provider: input.provider ?? "toss",
      event_type: input.eventType,
      event_id: input.eventId ?? null,
      payment_key: input.paymentKey ?? null,
      order_id: input.orderId ?? null,
      raw_payload: input.rawPayload,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[webhook] insertWebhookLog:", error.message);
    return null;
  }

  return { id: data.id };
}

export async function findProcessedWebhookDuplicate(input: {
  provider?: string;
  eventId?: string | null;
  paymentKey?: string | null;
  eventType: string;
}): Promise<boolean> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return false;
  }

  const provider = input.provider ?? "toss";

  if (input.eventId) {
    const { data } = await supabase
      .from("webhook_logs")
      .select("id")
      .eq("provider", provider)
      .eq("event_id", input.eventId)
      .eq("status", "processed")
      .limit(1)
      .maybeSingle();

    if (data) {
      return true;
    }
  }

  if (input.paymentKey) {
    const { data } = await supabase
      .from("webhook_logs")
      .select("id")
      .eq("provider", provider)
      .eq("payment_key", input.paymentKey)
      .eq("event_type", input.eventType)
      .eq("status", "processed")
      .limit(1)
      .maybeSingle();

    if (data) {
      return true;
    }
  }

  return false;
}

export async function updateWebhookLogStatus(input: {
  id: string;
  status: WebhookLogStatus;
  errorMessage?: string | null;
}): Promise<void> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("webhook_logs")
    .update({
      status: input.status,
      error_message: input.errorMessage ?? null,
      processed_at: new Date().toISOString(),
    })
    .eq("id", input.id);

  if (error) {
    console.error("[webhook] updateWebhookLogStatus:", error.message);
  }
}

export async function getRecentWebhookLogs(limit = 50): Promise<WebhookLogRecord[]> {
  const supabase = createServiceRoleSupabaseClient();
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
    console.error("[webhook] getRecentWebhookLogs:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapWebhookLogRow(row as WebhookLogRow));
}

export type PaymentLookupResult = {
  payment: PaymentRow;
  order: {
    id: string;
    user_id: string;
    product_name: string;
    product_type: string | null;
    payment_status: string;
    shipping_status: string;
    paid_at: string | null;
  };
};

export async function lookupPaymentByKeyOrOrderId(input: {
  paymentKey?: string | null;
  orderId?: string | null;
}): Promise<PaymentLookupResult | null> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return null;
  }

  let paymentRow: PaymentRow | null = null;

  if (input.paymentKey) {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("payment_key", input.paymentKey)
      .maybeSingle();

    paymentRow = (data as PaymentRow | null) ?? null;
  }

  if (!paymentRow && input.orderId) {
    const orderId = input.orderId;

    const byOrderUuid = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    paymentRow = (byOrderUuid.data as PaymentRow | null) ?? null;

    if (!paymentRow) {
      const { data: orderMatch } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", orderId)
        .maybeSingle();

      if (orderMatch?.id) {
        const { data } = await supabase
          .from("payments")
          .select("*")
          .eq("order_id", orderMatch.id)
          .maybeSingle();

        paymentRow = (data as PaymentRow | null) ?? null;
      }
    }
  }

  if (!paymentRow) {
    return null;
  }

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, product_name, product_type, payment_status, shipping_status, paid_at")
    .eq("id", paymentRow.order_id)
    .maybeSingle();

  if (orderError || !orderData) {
    console.error("[webhook] lookupPayment order:", orderError?.message);
    return null;
  }

  return {
    payment: paymentRow,
    order: orderData as PaymentLookupResult["order"],
  };
}
