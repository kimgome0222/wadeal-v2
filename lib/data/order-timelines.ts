import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type OrderTimelineStatus =
  | "created"
  | "paid"
  | "shipped"
  | "delivered"
  | "confirmed"
  | "cancel_requested"
  | "cancelled"
  | "refund_requested"
  | "refund_rejected"
  | "refunded"
  | "partial_refunded";

export type OrderTimelineEntry = {
  id: string;
  orderId: string;
  status: OrderTimelineStatus;
  title: string;
  message: string | null;
  createdAt: string;
};

function mapTimelineRow(row: Record<string, unknown>): OrderTimelineEntry {
  return {
    id: row.id as string,
    orderId: row.order_id as string,
    status: row.status as OrderTimelineStatus,
    title: row.title as string,
    message: (row.message as string | null) ?? null,
    createdAt: row.created_at as string,
  };
}

export async function getOrderTimelines(orderId: string): Promise<OrderTimelineEntry[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const client = supabase;
  const timelineDb = client as unknown as {
    from: (table: string) => ReturnType<typeof client.from>;
  };

  const { data, error } = await timelineDb
    .from("order_timelines")
    .select("id, order_id, status, title, message, created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[order-timelines] getOrderTimelines:", error.message);
    }
    return [];
  }

  return (data ?? []).map((row: Record<string, unknown>) => mapTimelineRow(row));
}

export async function appendOrderTimeline(input: {
  orderId: string;
  status: OrderTimelineStatus;
  title: string;
  message?: string | null;
  actorUserId?: string | null;
}): Promise<{ success: boolean; id?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false };
  }

  const supabase = createServiceRoleSupabaseClient() ?? (await createServerSupabaseClient());
  if (!supabase) {
    return { success: false };
  }

  const client = supabase;
  const timelineDb = client as unknown as {
    from: (table: string) => ReturnType<typeof client.from>;
  };

  const { data, error } = await timelineDb
    .from("order_timelines")
    .insert({
      order_id: input.orderId,
      status: input.status,
      title: input.title,
      message: input.message?.trim() || null,
      actor_user_id: input.actorUserId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[order-timelines] appendOrderTimeline:", error.message);
    }
    return { success: false };
  }

  return { success: true, id: (data as { id: string } | null)?.id };
}

export function buildFallbackOrderTimeline(order: {
  id: string;
  createdAt: string;
  paymentStatus: string;
  shippingStatus: string;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  confirmedAt?: string | null;
  cancelReason?: string | null;
  refundReason?: string | null;
  refundRequestedAt?: string | null;
}): OrderTimelineEntry[] {
  const entries: OrderTimelineEntry[] = [
    {
      id: `${order.id}-created`,
      orderId: order.id,
      status: "created",
      title: "주문 접수",
      message: "상품 구매 접수됐어요.",
      createdAt: order.createdAt,
    },
  ];

  if (order.paymentStatus === "paid" || order.paymentStatus === "refunded") {
    entries.push({
      id: `${order.id}-paid`,
      orderId: order.id,
      status: "paid",
      title: "결제 완료",
      message: null,
      createdAt: order.createdAt,
    });
  }

  if (order.shippedAt) {
    entries.push({
      id: `${order.id}-shipped`,
      orderId: order.id,
      status: "shipped",
      title: "배송 시작",
      message: null,
      createdAt: order.shippedAt,
    });
  }

  if (order.deliveredAt) {
    entries.push({
      id: `${order.id}-delivered`,
      orderId: order.id,
      status: "delivered",
      title: "배송 완료",
      message: null,
      createdAt: order.deliveredAt,
    });
  }

  if (order.confirmedAt) {
    entries.push({
      id: `${order.id}-confirmed`,
      orderId: order.id,
      status: "confirmed",
      title: "구매 확정",
      message: null,
      createdAt: order.confirmedAt,
    });
  }

  if (order.refundRequestedAt) {
    entries.push({
      id: `${order.id}-refund-requested`,
      orderId: order.id,
      status: "refund_requested",
      title: "환불 요청",
      message: order.refundReason ?? null,
      createdAt: order.refundRequestedAt,
    });
  }

  if (order.cancelReason) {
    entries.push({
      id: `${order.id}-cancelled`,
      orderId: order.id,
      status: "cancelled",
      title: "주문 취소",
      message: order.cancelReason,
      createdAt: order.refundRequestedAt ?? order.createdAt,
    });
  }

  if (order.refundReason && order.paymentStatus === "refunded") {
    entries.push({
      id: `${order.id}-refunded`,
      orderId: order.id,
      status: "refunded",
      title: "환불 완료",
      message: order.refundReason,
      createdAt: order.refundRequestedAt ?? order.createdAt,
    });
  }

  return entries;
}
