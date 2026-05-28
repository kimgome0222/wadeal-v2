import {
  canWriteReview,
  formatReviewDeadline as formatShippingReviewDeadline,
  getDaysSince,
  getReviewDeadlineDate,
  normalizeShippingStatusWithConfirmed,
  REVIEW_WINDOW_DAYS,
} from "@/lib/orders/shipping-status";

export {
  REVIEW_WINDOW_DAYS,
  getDaysSince,
  getReviewDeadlineDate,
  canWriteReview,
};

export type ReviewWriteStatus =
  | "writable"
  | "completed"
  | "expired"
  | "awaiting_confirmation";

export type UserOrderRecord = {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  joinedPrice: number;
  finalPrice: number | null;
  quantity: number;
  orderStatus: string;
  paymentStatus: string;
  shippingStatus: string;
  trackingCompany?: string | null;
  trackingNumber?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  confirmedAt?: string | null;
  cancelReason?: string | null;
  refundReason?: string | null;
  refundRequestedAt?: string | null;
  currentMembers: number;
  targetMembers: number;
  status: string;
  createdAt: string;
  paymentMethod?: string | null;
  paymentFlow?: string | null;
  productType?: string | null;
};

export function formatReviewDeadline(order: UserOrderRecord): string {
  if (order.confirmedAt) {
    return formatShippingReviewDeadline(order.confirmedAt);
  }

  const deadline = getReviewDeadlineDate(order.createdAt);
  const deadlineLabel = `${deadline.getFullYear()}.${String(deadline.getMonth() + 1).padStart(2, "0")}.${String(deadline.getDate()).padStart(2, "0")}`;
  return `구매 확정 후 ${REVIEW_WINDOW_DAYS}일 · ${deadlineLabel}까지 작성 가능`;
}

export function getReviewWriteStatus(
  order: UserOrderRecord,
  hasWrittenReview: boolean,
): ReviewWriteStatus {
  if (hasWrittenReview) {
    return "completed";
  }

  if (normalizeShippingStatusWithConfirmed(order.shippingStatus) !== "confirmed") {
    return "awaiting_confirmation";
  }

  if (!order.confirmedAt || getDaysSince(order.confirmedAt) > REVIEW_WINDOW_DAYS) {
    return "expired";
  }

  if (!canWriteReview(order)) {
    return "expired";
  }

  return "writable";
}

export function getReviewStatusLabel(status: ReviewWriteStatus): string {
  if (status === "completed") {
    return "작성 완료";
  }
  if (status === "awaiting_confirmation") {
    return "구매 확정 필요";
  }
  if (status === "expired") {
    return "기간 만료";
  }
  return "리뷰 작성 가능";
}

export function maskAuthorName(name: string, email?: string | null): string {
  const trimmedName = name.trim();
  const trimmedEmail = email?.trim() ?? "";

  if (!trimmedName && !trimmedEmail) {
    return "구매자";
  }

  const emailSource =
    trimmedEmail || (trimmedName.includes("@") ? trimmedName : "");

  if (emailSource.includes("@")) {
    const localPart = emailSource.split("@")[0] ?? "";
    if (!localPart) {
      return "구매자";
    }

    return localPart.slice(0, 2);
  }

  const source = trimmedName || trimmedEmail;
  if (source.length <= 1) {
    return "구매자";
  }

  if (source.length === 2) {
    return `${source[0]}*`;
  }

  return `${source[0]}****${source[source.length - 1]}`;
}

export function maskUserId(userId: string): string {
  const trimmed = userId.trim();
  if (!trimmed) {
    return "알 수 없음";
  }

  if (trimmed.length <= 8) {
    return `${trimmed.slice(0, 2)}***`;
  }

  return `${trimmed.slice(0, 4)}***${trimmed.slice(-4)}`;
}

export function renderStarString(rating: number): string {
  const safe = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"★".repeat(safe)}${"☆".repeat(5 - safe)}`;
}
