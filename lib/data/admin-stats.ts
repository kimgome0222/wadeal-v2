import {
  buildOrderNumber,
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  normalizeOrderStatus,
  normalizePaymentStatus,
  normalizeShippingStatus,
  type OrderStatus,
  type PaymentStatus,
  type ShippingStatus,
} from "@/lib/orders/admin-order-status";
import { getAllAdminOrdersDetailed, type AdminOrderDetail } from "@/lib/data/admin-orders";
import {
  CLOSING_SOON_HOURS,
  type AdminDashboardStats,
  type AdminRecentOrderRow,
  type AdminStatsPeriod,
  type PopularGroupBuyRow,
  type PopularGroupBuySortBy,
  type StatusCountRow,
} from "@/lib/data/admin-stats-shared";
export {
  ADMIN_STATS_PERIOD_LABELS,
  ADMIN_STATS_PERIODS,
  CLOSING_SOON_HOURS,
  POPULAR_GROUP_BUY_SORT_LABELS,
  POPULAR_GROUP_BUY_SORT_OPTIONS,
  parseAdminStatsPeriod,
  parsePopularGroupBuySort,
  type AdminDashboardStats,
  type AdminRecentOrderRow,
  type AdminStatsPeriod,
  type PopularGroupBuyRow,
  type PopularGroupBuySortBy,
  type StatusCountRow,
} from "@/lib/data/admin-stats-shared";
import { deals as mockDeals } from "@/lib/deals";
import { shouldUseMockData } from "@/lib/env/runtime";
import {
  getCurrentTierIndex,
  getNextTierInfo,
  parsePriceTiersJson,
  resolveDealPriceTiers,
  type PriceTierEntry,
} from "@/lib/pricing/tiers";
import { maskUserId } from "@/lib/reviews/review-rules";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type OrderAggregateRow = {
  quantity: number;
  joined_price: number;
  final_price: number | null;
  payment_amount: number | null;
  order_status: string;
  payment_status: string;
  shipping_status: string;
  created_at: string;
  user_id: string;
  product_id: string;
  product_name: string;
  id: string;
  order_number: string | null;
};

type DealAggregateRow = {
  id: string;
  product_id: string;
  title: string;
  current_participants: number;
  target_participants: number;
  price_tiers: unknown;
  group_price: number;
  lowest_price: number;
  status: string;
  ends_at: string;
  products?: { name: string; slug: string; original_price: number } | null;
};

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[admin-stats] using mock fallback: ${context}`);
  }
}

export function getPeriodDateRange(period: AdminStatsPeriod): {
  fromIso: string | null;
  toIso: string | null;
} {
  if (period === "all") {
    return { fromIso: null, toIso: null };
  }

  const now = new Date();
  const toIso = now.toISOString();

  if (period === "today") {
    return { fromIso: startOfTodayIso(), toIso };
  }

  const from = new Date(now);
  from.setDate(from.getDate() - (period === "7d" ? 7 : 30));
  return { fromIso: from.toISOString(), toIso };
}

function startOfTodayIso(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

function isWithinPeriod(isoDate: string, period: AdminStatsPeriod): boolean {
  const { fromIso, toIso } = getPeriodDateRange(period);
  const time = new Date(isoDate).getTime();

  if (Number.isNaN(time)) {
    return false;
  }

  if (fromIso && time < new Date(fromIso).getTime()) {
    return false;
  }

  if (toIso && time > new Date(toIso).getTime()) {
    return false;
  }

  return true;
}

function isExcludedFromRevenue(orderStatus: OrderStatus, paymentStatus: PaymentStatus): boolean {
  return orderStatus === "cancelled" || orderStatus === "refunded" || paymentStatus === "refunded";
}

function estimateOrderAmount(row: Pick<OrderAggregateRow, "joined_price" | "quantity">): number {
  return row.joined_price * row.quantity;
}

function confirmedOrderAmount(
  row: Pick<OrderAggregateRow, "final_price" | "payment_amount" | "joined_price" | "quantity">,
): number | null {
  if (row.final_price != null) {
    return row.final_price * row.quantity;
  }

  if (row.payment_amount != null) {
    return row.payment_amount;
  }

  return null;
}

function resolveDealTiers(deal: DealAggregateRow): PriceTierEntry[] {
  const productOriginal = deal.products?.original_price ?? deal.group_price;
  return resolveDealPriceTiers(
    {
      priceTiers: parsePriceTiersJson(deal.price_tiers),
      originalPrice: productOriginal,
      groupPrice: deal.group_price,
      lowestPrice: deal.lowest_price,
      targetParticipants: deal.target_participants,
    },
  );
}

function buildStatusCounts<T extends string>(
  rows: T[],
  labels: Record<T, string>,
): StatusCountRow[] {
  const counts = new Map<T, number>();

  for (const row of rows) {
    counts.set(row, (counts.get(row) ?? 0) + 1);
  }

  return Object.keys(labels).map((key) => {
    const typedKey = key as T;
    return {
      key,
      label: labels[typedKey],
      count: counts.get(typedKey) ?? 0,
    };
  });
}

function aggregateOrders(
  orders: OrderAggregateRow[],
  period: AdminStatsPeriod,
): Pick<
  AdminDashboardStats,
  | "totalOrders"
  | "todayOrders"
  | "totalParticipationQty"
  | "expectedRevenue"
  | "confirmedRevenue"
  | "refundAmount"
  | "ordersByOrderStatus"
  | "ordersByPaymentStatus"
  | "ordersByShippingStatus"
> {
  const periodOrders = orders.filter((order) => isWithinPeriod(order.created_at, period));
  const todayStart = startOfTodayIso();
  const todayOrders = orders.filter(
    (order) => new Date(order.created_at).getTime() >= new Date(todayStart).getTime(),
  ).length;

  let totalParticipationQty = 0;
  let expectedRevenue = 0;
  let confirmedRevenue = 0;
  let refundAmount = 0;

  const orderStatuses: OrderStatus[] = [];
  const paymentStatuses: PaymentStatus[] = [];
  const shippingStatuses: ShippingStatus[] = [];

  for (const order of periodOrders) {
    const orderStatus = normalizeOrderStatus(order.order_status);
    const paymentStatus = normalizePaymentStatus(order.payment_status);
    const shippingStatus = normalizeShippingStatus(order.shipping_status);

    orderStatuses.push(orderStatus);
    paymentStatuses.push(paymentStatus);
    shippingStatuses.push(shippingStatus);

    if (isExcludedFromRevenue(orderStatus, paymentStatus)) {
      if (orderStatus === "refunded" || paymentStatus === "refunded") {
        const refundBase =
          confirmedOrderAmount(order) ?? estimateOrderAmount(order);
        refundAmount += refundBase;
      }
      continue;
    }

    totalParticipationQty += order.quantity;
    expectedRevenue += estimateOrderAmount(order);

    if (
      order.final_price != null &&
      (paymentStatus === "paid" || orderStatus === "confirmed")
    ) {
      confirmedRevenue += order.final_price * order.quantity;
    }
  }

  const orderStatusLabels = {
    pending: getOrderStatusLabel("pending"),
    joined: getOrderStatusLabel("joined"),
    confirmed: getOrderStatusLabel("confirmed"),
    cancelled: getOrderStatusLabel("cancelled"),
    refunded: getOrderStatusLabel("refunded"),
  } as const;

  const paymentStatusLabels = {
    ready: "결제 준비",
    waiting_deposit: "입금 대기",
    authorized: "결제 승인",
    paid: "결제 완료",
    failed: "결제 실패",
    cancelled: "결제 취소",
    refunded: "환불 완료",
  } as const;

  const shippingStatusLabels = {
    none: "배송 전",
    preparing: "배송 준비",
    shipped: "배송 중",
    delivered: "배송 완료",
    confirmed: "구매 확정",
    returned: "반품",
  } as const;

  return {
    totalOrders: periodOrders.length,
    todayOrders,
    totalParticipationQty,
    expectedRevenue,
    confirmedRevenue,
    refundAmount,
    ordersByOrderStatus: buildStatusCounts(orderStatuses, orderStatusLabels),
    ordersByPaymentStatus: buildStatusCounts(paymentStatuses, paymentStatusLabels),
    ordersByShippingStatus: buildStatusCounts(shippingStatuses, shippingStatusLabels),
  };
}

function aggregateDeals(deals: DealAggregateRow[]): Pick<
  AdminDashboardStats,
  "activeGroupBuys" | "closingSoonGroupBuys" | "groupBuyOps"
> {
  const nowMs = Date.now();
  const closingSoonDeadlineMs = nowMs + CLOSING_SOON_HOURS * 60 * 60 * 1000;

  const activeDeals = deals.filter((deal) => {
    if (deal.status !== "active") {
      return false;
    }

    const endsMs = new Date(deal.ends_at).getTime();
    return !Number.isNaN(endsMs) && endsMs > nowMs;
  });

  const closingSoonGroupBuys = activeDeals.filter((deal) => {
    const endsMs = new Date(deal.ends_at).getTime();
    return !Number.isNaN(endsMs) && endsMs <= closingSoonDeadlineMs;
  }).length;

  const closedProducts = deals.filter(
    (deal) => deal.status === "closed" || deal.status === "cancelled",
  ).length;

  const goalAchievedCount = activeDeals.filter(
    (deal) => deal.current_participants >= deal.target_participants,
  ).length;

  let tierStageSum = 0;
  let maxTierStages = 0;
  let totalQtyToNextTier = 0;

  for (const deal of activeDeals) {
    const tiers = resolveDealTiers(deal);
    const tierIndex = getCurrentTierIndex(tiers, deal.current_participants);
    const { remainingQty } = getNextTierInfo(tiers, deal.current_participants);

    tierStageSum += Math.max(0, tierIndex + 1);
    maxTierStages = Math.max(maxTierStages, tiers.length);
    totalQtyToNextTier += remainingQty;
  }

  return {
    activeGroupBuys: activeDeals.length,
    closingSoonGroupBuys,
    groupBuyOps: {
      inProgressProducts: activeDeals.length,
      closedProducts,
      goalAchievementRate:
        activeDeals.length > 0 ?
          Math.round((goalAchievedCount / activeDeals.length) * 100)
        : null,
      avgTierStage:
        activeDeals.length > 0 ?
          Math.round((tierStageSum / activeDeals.length) * 10) / 10
        : null,
      maxTierStages,
      totalQtyToNextTier,
    },
  };
}

async function loadBuyerNames(userIds: string[]): Promise<Map<string, string>> {
  const names = new Map<string, string>();

  if (userIds.length === 0 || !isSupabaseConfigured()) {
    return names;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return names;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, email")
    .in("id", userIds);

  if (error) {
    console.error("[admin-stats] loadBuyerNames:", error.message);
    return names;
  }

  for (const row of data ?? []) {
    const nickname = (row.nickname as string | null) ?? null;
    const email = (row.email as string | null) ?? null;
    names.set(
      row.id as string,
      nickname ?? (email ? email.split("@")[0] ?? email : maskUserId(row.id as string)),
    );
  }

  return names;
}

function mapRecentOrderRow(
  order: AdminOrderDetail,
): AdminRecentOrderRow {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    productName: order.productName,
    buyerName: order.buyerName,
    quantity: order.quantity,
    estimatedAmount: order.joinedPrice * order.quantity,
    confirmedAmount:
      order.finalPrice != null ? order.finalPrice * order.quantity : null,
    orderStatus: order.orderStatus,
    orderStatusLabel: getOrderStatusLabel(order.orderStatus),
    orderDate: order.orderDate,
    orderDateIso: order.orderDateIso,
  };
}

function buildMockOrderRows(): OrderAggregateRow[] {
  return mockDeals.flatMap((deal, index) => {
    const createdAt = new Date(Date.now() - index * 86_400_000).toISOString();
    return [
      {
        id: `mock-stats-order-${deal.slug}-1`,
        user_id: "00000000-0000-4000-8000-000000000001",
        product_id: deal.slug,
        product_name: deal.title,
        order_number: `WD-MOCK${String(index + 1).padStart(4, "0")}`,
        quantity: 1 + (index % 2),
        joined_price: deal.groupPrice,
        final_price: index % 3 === 0 ? deal.lowestPrice : null,
        payment_amount: null,
        order_status: index % 4 === 0 ? "confirmed" : "joined",
        payment_status: index % 4 === 0 ? "paid" : "ready",
        shipping_status: index % 5 === 0 ? "preparing" : "none",
        created_at: createdAt,
      },
    ];
  });
}

function buildMockDealRows(): DealAggregateRow[] {
  return mockDeals.map((deal) => ({
    id: deal.dealId ?? `mock-deal-${deal.slug}`,
    product_id: deal.slug,
    title: deal.title,
    current_participants: deal.participants,
    target_participants: deal.targetParticipants,
    price_tiers: deal.priceTiers ?? [],
    group_price: deal.groupPrice,
    lowest_price: deal.lowestPrice,
    status: deal.dealStatus ?? "active",
    ends_at:
      deal.endsAt ??
      new Date(Date.now() + deal.endsInMinutes * 60_000).toISOString(),
    products: {
      name: deal.title,
      slug: deal.slug,
      original_price: deal.originalPrice,
    },
  }));
}

async function fetchOrderRows(): Promise<OrderAggregateRow[]> {
  if (!isSupabaseConfigured()) {
    logMockFallback("fetchOrderRows: Supabase not configured");
    return shouldUseMockData() ? buildMockOrderRows() : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("fetchOrderRows: client unavailable");
    return shouldUseMockData() ? buildMockOrderRows() : [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, product_id, product_name, order_number, quantity, joined_price, final_price, payment_amount, order_status, payment_status, shipping_status, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin-stats] fetchOrderRows:", error.message);
    logMockFallback("fetchOrderRows: query error");
    return shouldUseMockData() ? buildMockOrderRows() : [];
  }

  if (!data || data.length === 0) {
    logMockFallback("fetchOrderRows: empty result");
    return shouldUseMockData() ? buildMockOrderRows() : [];
  }

  return data as OrderAggregateRow[];
}

async function fetchDealRows(): Promise<DealAggregateRow[]> {
  if (!isSupabaseConfigured()) {
    logMockFallback("fetchDealRows: Supabase not configured");
    return shouldUseMockData() ? buildMockDealRows() : [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    logMockFallback("fetchDealRows: client unavailable");
    return shouldUseMockData() ? buildMockDealRows() : [];
  }

  const { data, error } = await supabase
    .from("group_buy_deals")
    .select(
      `
      id,
      product_id,
      title,
      current_participants,
      target_participants,
      price_tiers,
      group_price,
      lowest_price,
      status,
      ends_at
    `,
    );

  if (error) {
    console.error("[admin-stats] fetchDealRows:", error.message);
    logMockFallback("fetchDealRows: query error");
    return shouldUseMockData() ? buildMockDealRows() : [];
  }

  if (!data || data.length === 0) {
    logMockFallback("fetchDealRows: empty result");
    return shouldUseMockData() ? buildMockDealRows() : [];
  }

  const productIds = [...new Set(data.map((row) => row.product_id as string))];
  const productMap = new Map<
    string,
    { name: string; slug: string; original_price: number }
  >();

  if (productIds.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, slug, original_price")
      .in("id", productIds);

    if (productsError) {
      console.error("[admin-stats] fetchDealRows products:", productsError.message);
    } else {
      for (const product of products ?? []) {
        productMap.set(product.id as string, {
          name: product.name as string,
          slug: product.slug as string,
          original_price: product.original_price as number,
        });
      }
    }
  }

  return (data as Omit<DealAggregateRow, "products">[]).map((row) => ({
    ...row,
    products: productMap.get(row.product_id) ?? null,
  }));
}

async function countSavedByProduct(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      for (const deal of mockDeals) {
        counts.set(deal.slug, deal.saved ? 12 + deal.participants : deal.participants % 5);
      }
    }
    return counts;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return counts;
  }

  const { data, error } = await supabase.from("saved_deals").select("product_id");

  if (error) {
    console.error("[admin-stats] countSavedByProduct:", error.message);
    return counts;
  }

  for (const row of data ?? []) {
    const productId = row.product_id as string;
    counts.set(productId, (counts.get(productId) ?? 0) + 1);
  }

  return counts;
}

async function countSharesByProduct(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      for (const deal of mockDeals) {
        counts.set(deal.slug, 3 + deal.participants % 20);
      }
    }
    return counts;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return counts;
  }

  const { data, error } = await supabase.from("share_logs").select("product_id");

  if (error) {
    console.error("[admin-stats] countSharesByProduct:", error.message);
    return counts;
  }

  for (const row of data ?? []) {
    const productId = row.product_id as string;
    counts.set(productId, (counts.get(productId) ?? 0) + 1);
  }

  return counts;
}

async function countViewsByProduct(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      for (const deal of mockDeals) {
        counts.set(deal.slug, 20 + deal.participants * 2);
      }
    }
    return counts;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return counts;
  }

  const { data, error } = await supabase.from("recent_views").select("product_id");

  if (error) {
    console.error("[admin-stats] countViewsByProduct:", error.message);
    return counts;
  }

  for (const row of data ?? []) {
    const productId = row.product_id as string;
    counts.set(productId, (counts.get(productId) ?? 0) + 1);
  }

  return counts;
}

export async function getAdminDashboardStats(
  period: AdminStatsPeriod,
): Promise<AdminDashboardStats> {
  const [orders, deals] = await Promise.all([fetchOrderRows(), fetchDealRows()]);
  const orderAgg = aggregateOrders(orders, period);
  const dealAgg = aggregateDeals(deals);

  let dataSource: AdminDashboardStats["dataSource"] = "supabase";
  if (!isSupabaseConfigured() || orders.length === 0) {
    dataSource = shouldUseMockData() ? "mock" : "empty";
  }

  return {
    ...orderAgg,
    ...dealAgg,
    dataSource,
  };
}

export async function getRecentAdminOrders(
  limit: number,
  period: AdminStatsPeriod,
): Promise<AdminRecentOrderRow[]> {
  if (!isSupabaseConfigured()) {
    if (!shouldUseMockData()) {
      return [];
    }

    const mockDetails = await getAllAdminOrdersDetailed();
    return mockDetails
      .filter((order) => isWithinPeriod(order.orderDateIso, period))
      .slice(0, limit)
      .map(mapRecentOrderRow);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    if (shouldUseMockData()) {
      const mockDetails = await getAllAdminOrdersDetailed();
      return mockDetails
        .filter((order) => isWithinPeriod(order.orderDateIso, period))
        .slice(0, limit)
        .map(mapRecentOrderRow);
    }
    return [];
  }

  const { fromIso } = getPeriodDateRange(period);
  let query = supabase
    .from("orders")
    .select(
      "id, user_id, product_id, product_name, order_number, quantity, joined_price, final_price, payment_amount, order_status, payment_status, shipping_status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (fromIso) {
    query = query.gte("created_at", fromIso);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[admin-stats] getRecentAdminOrders:", error.message);
    return [];
  }

  const rows = (data ?? []) as OrderAggregateRow[];
  const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))];
  const buyerNames = await loadBuyerNames(userIds);

  return rows.map((row) => {
    const orderStatus = normalizeOrderStatus(row.order_status);
    return {
      id: row.id,
      orderNumber: row.order_number ?? buildOrderNumber(row.id),
      productName: row.product_name,
      buyerName: buyerNames.get(row.user_id) ?? maskUserId(row.user_id),
      quantity: row.quantity,
      estimatedAmount: estimateOrderAmount(row),
      confirmedAmount: confirmedOrderAmount(row),
      orderStatus,
      orderStatusLabel: getOrderStatusLabel(orderStatus),
      orderDate: formatOrderDate(row.created_at),
      orderDateIso: row.created_at,
    };
  });
}

export async function getPopularGroupBuys(
  sortBy: PopularGroupBuySortBy,
  limit: number,
): Promise<PopularGroupBuyRow[]> {
  const deals = await fetchDealRows();
  const [savedCounts, shareCounts, viewCounts] = await Promise.all([
    countSavedByProduct(),
    countSharesByProduct(),
    countViewsByProduct(),
  ]);

  const rows: PopularGroupBuyRow[] = deals.map((deal) => {
    const productName = deal.products?.name ?? deal.title;
    const metricValue =
      sortBy === "participation" ? deal.current_participants
      : sortBy === "saved" ? savedCounts.get(deal.product_id) ?? 0
      : sortBy === "share" ? shareCounts.get(deal.product_id) ?? 0
      : viewCounts.get(deal.product_id) ?? 0;

    return {
      productId: deal.product_id,
      productName,
      productSlug: deal.products?.slug ?? null,
      dealId: deal.id,
      metricValue,
      currentParticipants: deal.current_participants,
      targetParticipants: deal.target_participants,
    };
  });

  return rows
    .sort((a, b) => b.metricValue - a.metricValue || b.currentParticipants - a.currentParticipants)
    .slice(0, limit);
}

export { formatOrderCurrency };
