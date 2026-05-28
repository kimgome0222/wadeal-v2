export const ADMIN_STATS_PERIODS = ["today", "7d", "30d", "all"] as const;
export type AdminStatsPeriod = (typeof ADMIN_STATS_PERIODS)[number];

export const ADMIN_STATS_PERIOD_LABELS: Record<AdminStatsPeriod, string> = {
  today: "오늘",
  "7d": "7일",
  "30d": "30일",
  all: "전체",
};

export const POPULAR_GROUP_BUY_SORT_OPTIONS = [
  "participation",
  "saved",
  "share",
  "views",
] as const;
export type PopularGroupBuySortBy = (typeof POPULAR_GROUP_BUY_SORT_OPTIONS)[number];

export const POPULAR_GROUP_BUY_SORT_LABELS: Record<PopularGroupBuySortBy, string> = {
  participation: "참여 수량",
  saved: "찜",
  share: "공유",
  views: "조회",
};

export const CLOSING_SOON_HOURS = 24;

export type StatusCountRow = {
  key: string;
  label: string;
  count: number;
};

export type AdminDashboardStats = {
  totalOrders: number;
  todayOrders: number;
  totalParticipationQty: number;
  expectedRevenue: number;
  confirmedRevenue: number;
  refundAmount: number;
  activeGroupBuys: number;
  closingSoonGroupBuys: number;
  groupBuyOps: {
    inProgressProducts: number;
    closedProducts: number;
    goalAchievementRate: number | null;
    avgTierStage: number | null;
    maxTierStages: number;
    totalQtyToNextTier: number;
  };
  ordersByOrderStatus: StatusCountRow[];
  ordersByPaymentStatus: StatusCountRow[];
  ordersByShippingStatus: StatusCountRow[];
  dataSource: "supabase" | "mock" | "empty";
};

export type AdminRecentOrderRow = {
  id: string;
  orderNumber: string;
  productName: string;
  buyerName: string;
  quantity: number;
  estimatedAmount: number;
  confirmedAmount: number | null;
  orderStatus: import("@/lib/orders/order-status").OrderStatus;
  orderStatusLabel: string;
  orderDate: string;
  orderDateIso: string;
};

export type PopularGroupBuyRow = {
  productId: string;
  productName: string;
  productSlug: string | null;
  dealId: string | null;
  metricValue: number;
  currentParticipants: number;
  targetParticipants: number;
};

export function parseAdminStatsPeriod(value: string | undefined): AdminStatsPeriod {
  if (value && (ADMIN_STATS_PERIODS as readonly string[]).includes(value)) {
    return value as AdminStatsPeriod;
  }

  return "7d";
}

export function parsePopularGroupBuySort(
  value: string | undefined,
): PopularGroupBuySortBy {
  if (value && (POPULAR_GROUP_BUY_SORT_OPTIONS as readonly string[]).includes(value)) {
    return value as PopularGroupBuySortBy;
  }

  return "participation";
}
