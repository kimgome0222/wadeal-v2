import {
  normalizeShippingStatus,
  type ShippingStatus,
} from "@/lib/orders/order-status";

export const REVIEW_WINDOW_DAYS = 15;

export const SHIPPING_STATUSES_WITH_CONFIRMED = [
  "none",
  "preparing",
  "shipped",
  "delivered",
  "confirmed",
  "returned",
] as const;

export type ShippingStatusWithConfirmed = (typeof SHIPPING_STATUSES_WITH_CONFIRMED)[number];

const SHIPPING_STATUS_LABELS: Record<ShippingStatusWithConfirmed, string> = {
  none: "배송 전",
  preparing: "배송 준비",
  shipped: "배송 중",
  delivered: "배송 완료",
  confirmed: "구매 확정",
  returned: "반품",
};

export type OrderShippingFields = {
  shippingStatus: string;
  confirmedAt?: string | null;
};

export function isShippingStatusWithConfirmed(
  value: string,
): value is ShippingStatusWithConfirmed {
  return (SHIPPING_STATUSES_WITH_CONFIRMED as readonly string[]).includes(value);
}

export function normalizeShippingStatusWithConfirmed(
  value: string | null | undefined,
): ShippingStatusWithConfirmed {
  const normalized = normalizeShippingStatus(value);
  if (value === "confirmed" || value === "구매확정") {
    return "confirmed";
  }

  return normalized as ShippingStatusWithConfirmed;
}

export function getShippingStatusLabel(status: string): string {
  const normalized = normalizeShippingStatusWithConfirmed(status);
  return SHIPPING_STATUS_LABELS[normalized];
}

export function canConfirmPurchase(order: OrderShippingFields): boolean {
  return normalizeShippingStatusWithConfirmed(order.shippingStatus) === "delivered";
}

export function getDaysSince(isoDate: string): number {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function canWriteReview(order: OrderShippingFields): boolean {
  if (normalizeShippingStatusWithConfirmed(order.shippingStatus) !== "confirmed") {
    return false;
  }

  if (!order.confirmedAt) {
    return false;
  }

  return getDaysSince(order.confirmedAt) <= REVIEW_WINDOW_DAYS;
}

export function getReviewDeadlineDate(confirmedAt: string): Date {
  const deadline = new Date(confirmedAt);
  deadline.setDate(deadline.getDate() + REVIEW_WINDOW_DAYS);
  return deadline;
}

export function formatReviewDeadline(confirmedAt: string): string {
  const deadline = getReviewDeadlineDate(confirmedAt);
  const deadlineLabel = `${deadline.getFullYear()}.${String(deadline.getMonth() + 1).padStart(2, "0")}.${String(deadline.getDate()).padStart(2, "0")}`;
  return `구매 확정일 기준 ${REVIEW_WINDOW_DAYS}일 · ${deadlineLabel}까지 작성 가능`;
}

const COURIER_TRACKING_URLS: Record<string, (trackingNumber: string) => string> = {
  "cj대한통운": (n) => `https://www.cjlogistics.com/ko/tool/parcel/tracking?gn=${encodeURIComponent(n)}`,
  cj: (n) => `https://www.cjlogistics.com/ko/tool/parcel/tracking?gn=${encodeURIComponent(n)}`,
  "롯데택배": (n) => `https://www.lotteglogis.com/home/reservation/tracking/index?InvNo=${encodeURIComponent(n)}`,
  "한진택배": (n) => `https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnum=${encodeURIComponent(n)}`,
  "우체국택배": (n) => `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=${encodeURIComponent(n)}`,
  "쿠팡로켓": (n) => `https://www.cupost.co.kr/postbox/delivery/delivery_result.jsp?invoice_no=${encodeURIComponent(n)}`,
};

export function buildTrackingUrl(
  courierCompany: string | null | undefined,
  trackingNumber: string | null | undefined,
): string | null {
  const number = trackingNumber?.trim();
  if (!number) {
    return null;
  }

  const courier = courierCompany?.trim().toLowerCase() ?? "";
  if (courier) {
    for (const [key, buildUrl] of Object.entries(COURIER_TRACKING_URLS)) {
      if (courier.includes(key)) {
        return buildUrl(number);
      }
    }
  }

  return `https://tracker.delivery/#/${encodeURIComponent(courierCompany?.trim() || "unknown")}/${encodeURIComponent(number)}`;
}

export function toAdminShippingStatus(value: ShippingStatusWithConfirmed): ShippingStatus {
  if (value === "confirmed") {
    return "delivered";
  }

  return value;
}
