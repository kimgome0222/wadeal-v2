import { getPointBalance } from "@/lib/discounts/points";
import { getUserOrdersDetailed } from "@/lib/data/orders";
import { getRecentViewSlugsForUser } from "@/lib/data/recent-views";
import { getSavedDealSlugsForUser } from "@/lib/data/saved-deals";
import { getSupportTicketsForUser } from "@/lib/data/support-tickets";
import { getUserReviewedOrderIds } from "@/lib/data/reviews";
import { canPayOrder } from "@/lib/payments/can-pay-order";
import { normalizeOrderStatus, normalizePaymentStatus } from "@/lib/orders/order-status";
import { normalizeShippingStatusWithConfirmed } from "@/lib/orders/shipping-status";
import { isNormalProduct } from "@/lib/products/product-type";
import type { MypageDashboardSummary } from "@/lib/profile/types";
import { getReviewWriteStatus } from "@/lib/reviews/review-rules";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getUserCouponUsageCount(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    return shouldUseMockData() ? 1 : 0;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from("coupon_usages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("[data] getUserCouponUsageCount:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function getMypageDashboardSummary(
  userId: string,
): Promise<MypageDashboardSummary> {
  const [orders, reviewedOrderIds, pointsBalance, wishlistSlugs, recentSlugs, tickets, couponUsageCount] =
    await Promise.all([
      getUserOrdersDetailed(userId),
      getUserReviewedOrderIds(userId),
      getPointBalance(userId),
      getSavedDealSlugsForUser(userId),
      getRecentViewSlugsForUser(userId),
      getSupportTicketsForUser(userId),
      getUserCouponUsageCount(userId),
    ]);

  let paymentPendingCount = 0;
  let shippingCount = 0;
  let activeGroupBuyCount = 0;
  let reviewableCount = 0;

  for (const order of orders) {
    const orderStatus = normalizeOrderStatus(order.orderStatus);
    const paymentStatus = normalizePaymentStatus(order.paymentStatus);
    const shippingStatus = normalizeShippingStatusWithConfirmed(order.shippingStatus);

    if (canPayOrder(order)) {
      paymentPendingCount += 1;
    }

    if (
      paymentStatus === "paid" &&
      ["preparing", "shipped", "delivered"].includes(shippingStatus)
    ) {
      shippingCount += 1;
    }

    const isGroupBuy = !isNormalProduct(order.productType);
    if (
      isGroupBuy &&
      !["cancelled", "refunded"].includes(orderStatus) &&
      (orderStatus === "joined" ||
        (orderStatus === "confirmed" && paymentStatus !== "paid"))
    ) {
      activeGroupBuyCount += 1;
    }

    const reviewStatus = getReviewWriteStatus(
      order,
      reviewedOrderIds.includes(order.id),
    );
    if (reviewStatus === "writable") {
      reviewableCount += 1;
    }
  }

  const supportOpenCount = tickets.filter(
    (ticket) => ticket.status === "open" || ticket.status === "in_progress",
  ).length;

  return {
    totalOrders: orders.length,
    paymentPendingCount,
    shippingCount,
    activeGroupBuyCount,
    reviewableCount,
    pointsBalance,
    couponUsageCount,
    wishlistCount: wishlistSlugs.length,
    recentViewsCount: recentSlugs.length,
    supportOpenCount,
  };
}
