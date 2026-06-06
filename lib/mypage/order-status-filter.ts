import {
  matchesUserOrderDisplayFilter,
  type UserOrderDisplayFilter,
} from "@/lib/orders/order-status";

/** 마이페이지 주문 상태 바 query → display filter */
export const MYPAGE_ORDER_STATUS_QUERY_MAP = {
  paid: "결제완료",
  preparing: "배송준비",
  shipping: "배송중",
  delivered: "배송완료",
} as const satisfies Record<string, UserOrderDisplayFilter>;

export type MypageOrderStatusQuery = keyof typeof MYPAGE_ORDER_STATUS_QUERY_MAP;

export function parseMypageOrderStatusQuery(
  value: string | undefined,
): UserOrderDisplayFilter | null {
  if (!value) {
    return null;
  }
  return MYPAGE_ORDER_STATUS_QUERY_MAP[value as MypageOrderStatusQuery] ?? null;
}

export function filterOrdersByMypageStatus<T extends {
  orderStatus: string;
  paymentStatus: string;
  shippingStatus: string;
}>(orders: T[], filter: UserOrderDisplayFilter | null): T[] {
  if (!filter) {
    return orders;
  }
  return orders.filter((order) => matchesUserOrderDisplayFilter(order, filter));
}
