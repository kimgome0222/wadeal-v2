export const NOTIFICATION_TARGET_ROLES = ["user", "seller", "admin"] as const;
export type NotificationTargetRole = (typeof NOTIFICATION_TARGET_ROLES)[number];

export const USER_NOTIFICATION_TYPES = [
  "order_confirmed",
  "payment_ready",
  "payment_paid",
  "payment_failed",
  "payment_deposit_completed",
  "shipping_started",
  "shipping_delivered",
  "review_available",
  "refund_updated",
  "support_reply",
  "support_resolved",
  "deal_deadline_soon",
  "price_tier_reached",
  "next_tier_soon",
] as const;

export const SELLER_NOTIFICATION_TYPES = [
  "seller_application_approved",
  "seller_application_rejected",
  "seller_approved",
  "seller_rejected",
  "product_request_approved",
  "product_request_rejected",
  "product_approved",
  "product_rejected",
  "product_changes_requested",
  "new_order_received",
  "shipping_required",
  "new_product_question",
  "new_review",
  "settlement_confirmed",
  "settlement_ready",
  "settlement_paid",
  "seller_notice_published",
] as const;

export const ADMIN_NOTIFICATION_TYPES = [
  "new_seller_application",
  "new_product_request",
  "product_change_request",
  "refund_request",
  "escalated_support_ticket",
  "payment_webhook_failed",
  "critical_error",
  "settlement_pending",
  "prohibited_keyword_detected",
] as const;

export const NOTIFICATION_TYPES = [
  ...USER_NOTIFICATION_TYPES,
  ...SELLER_NOTIFICATION_TYPES,
  ...ADMIN_NOTIFICATION_TYPES,
] as const;

export type UserNotificationType = (typeof USER_NOTIFICATION_TYPES)[number];
export type SellerNotificationType = (typeof SELLER_NOTIFICATION_TYPES)[number];
export type AdminNotificationType = (typeof ADMIN_NOTIFICATION_TYPES)[number];
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationChannel = "in_app" | "kakao" | "email" | "push";

export type NotificationRecord = {
  id: string;
  userId: string | null;
  sellerId: string | null;
  targetRole: NotificationTargetRole;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl: string | null;
  channel: NotificationChannel;
  readAt: string | null;
  createdAt: string;
};

export function isNotificationType(value: string): value is NotificationType {
  return (NOTIFICATION_TYPES as readonly string[]).includes(value);
}

export function isNotificationTargetRole(value: string): value is NotificationTargetRole {
  return (NOTIFICATION_TARGET_ROLES as readonly string[]).includes(value);
}

export function getNotificationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    order_confirmed: "주문 확정",
    payment_ready: "결제 준비",
    payment_paid: "결제 완료",
    payment_failed: "결제 실패",
    shipping_started: "배송 시작",
    shipping_delivered: "배송 완료",
    review_available: "리뷰 작성",
    refund_updated: "환불 안내",
    deal_deadline_soon: "마감 임박",
    price_tier_reached: "가격 단계 달성",
    next_tier_soon: "다음 단계 임박",
    support_reply: "문의 답변",
    support_resolved: "문의 완료",
    seller_application_approved: "입점 승인",
    seller_application_rejected: "입점 반려",
    product_request_approved: "상품 승인",
    product_request_rejected: "상품 반려",
    new_order_received: "신규 주문",
    shipping_required: "송장 입력",
    new_product_question: "상품 문의",
    new_review: "신규 리뷰",
    settlement_confirmed: "정산 확정",
    settlement_paid: "정산 지급",
    seller_notice_published: "판매자 공지",
    new_seller_application: "신규 입점",
    new_product_request: "상품 검수",
    refund_request: "환불 요청",
    escalated_support_ticket: "긴급 문의",
    payment_webhook_failed: "웹훅 실패",
    critical_error: "치명적 오류",
    settlement_pending: "정산 대기",
    prohibited_keyword_detected: "금지 키워드",
  };

  return labels[type] ?? type;
}
