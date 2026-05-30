import { getAllActiveDeals } from "@/lib/data";
import { getRecentViewsForUser } from "@/lib/data/recent-views";
import { getUserOrdersDetailed } from "@/lib/data/orders";
import type { Deal } from "@/lib/deals";
import { normalizeOrderStatus, normalizePaymentStatus } from "@/lib/orders/order-status";
import { normalizeShippingStatusWithConfirmed } from "@/lib/orders/shipping-status";
import type { UserOrderRecord } from "@/lib/reviews/review-rules";
import { buildSellerProfilesFromDeals } from "@/lib/sellers/home-sellers";
import {
  getCouponApplicableDeals,
  getRepeatPurchaseDeals,
  getWishlistSimilarDeals,
} from "@/lib/growth/cart-growth-mock";

export type MypageOrderStatusCounts = {
  paid: number;
  preparing: number;
  shipping: number;
  delivered: number;
};

export type MypageRecentOrderItem = {
  id: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  price: number;
  sellerName: string;
};

export type MypageHubData = {
  orderStatusCounts: MypageOrderStatusCounts;
  recentOrders: MypageRecentOrderItem[];
  recentViewDeals: Deal[];
  recommendedDeals: Deal[];
  repeatPurchaseDeals: Deal[];
  couponRecommendedDeals: Deal[];
  wishlistSimilarDeals: Deal[];
  followedSellerPreviews: {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
  }[];
};

export function buildOrderStatusCounts(orders: UserOrderRecord[]): MypageOrderStatusCounts {
  const counts: MypageOrderStatusCounts = {
    paid: 0,
    preparing: 0,
    shipping: 0,
    delivered: 0,
  };

  for (const order of orders) {
    const orderStatus = normalizeOrderStatus(order.orderStatus);
    if (["cancelled", "refunded"].includes(orderStatus)) {
      continue;
    }

    const paymentStatus = normalizePaymentStatus(order.paymentStatus);
    const shippingStatus = normalizeShippingStatusWithConfirmed(order.shippingStatus);

    if (paymentStatus !== "paid") {
      continue;
    }

    if (shippingStatus === "preparing") {
      counts.preparing += 1;
    } else if (shippingStatus === "shipped") {
      counts.shipping += 1;
    } else if (shippingStatus === "delivered" || shippingStatus === "confirmed") {
      counts.delivered += 1;
    } else {
      counts.paid += 1;
    }
  }

  return counts;
}

function buildRecentOrders(
  orders: UserOrderRecord[],
  deals: Deal[],
  limit = 8,
): MypageRecentOrderItem[] {
  const dealBySlug = new Map(deals.map((deal) => [deal.slug, deal]));
  const seen = new Set<string>();
  const items: MypageRecentOrderItem[] = [];

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  for (const order of sorted) {
    if (seen.has(order.productId)) {
      continue;
    }
    seen.add(order.productId);

    const deal = dealBySlug.get(order.productId);
    items.push({
      id: order.id,
      productSlug: order.productId,
      productName: order.productName,
      imageUrl: deal?.imageUrl ?? "",
      price: order.finalPrice ?? order.joinedPrice,
      sellerName: deal?.brandName?.trim() || "celloh 셀러",
    });

    if (items.length >= limit) {
      break;
    }
  }

  return items;
}

export async function buildMypageHubData(userId: string): Promise<MypageHubData> {
  const [orders, recentViewDeals, catalog] = await Promise.all([
    getUserOrdersDetailed(userId),
    getRecentViewsForUser(userId),
    getAllActiveDeals(),
  ]);

  const sellers = buildSellerProfilesFromDeals(catalog);
  const recommendedDeals = [...catalog]
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 12);

  return {
    orderStatusCounts: buildOrderStatusCounts(orders),
    recentOrders: buildRecentOrders(orders, catalog, 8),
    recentViewDeals: recentViewDeals.slice(0, 12),
    recommendedDeals,
    repeatPurchaseDeals: getRepeatPurchaseDeals(catalog, 12),
    couponRecommendedDeals: getCouponApplicableDeals(catalog, 12),
    wishlistSimilarDeals: getWishlistSimilarDeals(
      catalog,
      recentViewDeals.slice(0, 3).map((deal) => deal.slug),
      12,
    ),
    followedSellerPreviews: sellers.slice(0, 10).map((seller) => ({
      id: seller.id,
      name: seller.name,
      rating: seller.rating,
      totalSales: seller.totalSales,
    })),
  };
}
