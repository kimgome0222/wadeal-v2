import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type SellerDashboardStats = {
  totalOrders: number;
  paidOrders: number;
  todayOrders: number;
  pendingShipment: number;
  refundRequestCount: number;
  totalRevenue: number;
  pendingSettlementAmount: number;
  avgRating: number | null;
  reviewCount: number;
  pendingReviewReplies: number;
};

const EMPTY_STATS: SellerDashboardStats = {
  totalOrders: 0,
  paidOrders: 0,
  todayOrders: 0,
  pendingShipment: 0,
  refundRequestCount: 0,
  totalRevenue: 0,
  pendingSettlementAmount: 0,
  avgRating: null,
  reviewCount: 0,
  pendingReviewReplies: 0,
};

export async function getSellerDashboardStats(
  sellerUserId: string,
  sellerId: string,
): Promise<SellerDashboardStats> {
  if (!isSupabaseConfigured()) {
    return EMPTY_STATS;
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return EMPTY_STATS;
  }

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("created_by", sellerUserId);

  const productIds = (products ?? []).map((row) => row.id as string);
  if (productIds.length === 0) {
    return EMPTY_STATS;
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      "payment_status, shipping_status, payment_amount, joined_price, final_price, quantity, refund_requested_at, refund_status, created_at",
    )
    .in("product_id", productIds)
    .not("order_status", "in", '("cancelled","refunded")');

  if (ordersError) {
    console.error("[seller-analytics] orders:", ordersError.message);
    return EMPTY_STATS;
  }

  let paidOrders = 0;
  let todayOrders = 0;
  let pendingShipment = 0;
  let totalRevenue = 0;
  let refundRequestCount = 0;

  const todayKey = new Date().toISOString().slice(0, 10);

  for (const row of orders ?? []) {
    const paymentStatus = row.payment_status as string;
    const shippingStatus = row.shipping_status as string;
    const quantity = (row.quantity as number) ?? 1;
    const joinedPrice = row.joined_price as number;
    const finalPrice = (row.final_price as number | null) ?? null;
    const paymentAmount =
      (row.payment_amount as number | null) ??
      (finalPrice != null ? finalPrice : joinedPrice * quantity);
    const createdAt = (row.created_at as string | null)?.slice(0, 10) ?? null;
    const refundRequestedAt = row.refund_requested_at as string | null;
    const refundStatus = (row.refund_status as string | null) ?? null;

    if (createdAt === todayKey) {
      todayOrders += 1;
    }

    if (refundRequestedAt && refundStatus !== "approved" && refundStatus !== "rejected") {
      refundRequestCount += 1;
    }

    if (paymentStatus === "paid") {
      paidOrders += 1;
      totalRevenue += paymentAmount;

      if (shippingStatus === "none" || shippingStatus === "preparing") {
        pendingShipment += 1;
      }
    }
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("id, rating")
    .in("product_id", productIds)
    .neq("status", "deleted");

  if (reviewsError) {
    console.error("[seller-analytics] reviews:", reviewsError.message);
  }

  const reviewRows = reviews ?? [];
  const reviewCount = reviewRows.length;
  const avgRating =
    reviewCount > 0 ?
      Math.round(
        (reviewRows.reduce((sum, row) => sum + ((row.rating as number) ?? 0), 0) / reviewCount) * 10,
      ) / 10
    : null;

  const reviewIds = reviewRows.map((row) => row.id as string);
  let pendingReviewReplies = 0;

  if (reviewIds.length > 0) {
    const { data: replies, error: repliesError } = await supabase
      .from("seller_review_replies")
      .select("review_id")
      .eq("seller_id", sellerId)
      .eq("status", "visible")
      .in("review_id", reviewIds);

    if (repliesError) {
      console.error("[seller-analytics] replies:", repliesError.message);
    } else {
      const replyRows = (replies ?? []) as { review_id: string }[];
      const repliedIds = new Set(replyRows.map((row) => row.review_id));
      pendingReviewReplies = reviewIds.filter((id) => !repliedIds.has(id)).length;
    }
  }

  const { data: pendingSettlements } = await supabase
    .from("settlement_records")
    .select("net_payout_amount")
    .eq("seller_id", sellerId)
    .in("status", ["confirmed", "seller_confirmed"]);

  const pendingSettlementAmount = (pendingSettlements ?? []).reduce(
    (sum, row) => sum + ((row.net_payout_amount as number) ?? 0),
    0,
  );

  return {
    totalOrders: (orders ?? []).length,
    paidOrders,
    todayOrders,
    pendingShipment,
    refundRequestCount,
    totalRevenue,
    pendingSettlementAmount,
    avgRating,
    reviewCount,
    pendingReviewReplies,
  };
}
