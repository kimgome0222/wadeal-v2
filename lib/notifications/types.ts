export const NOTIFICATION_TYPES = [
  "deal_deadline_soon",
  "price_tier_reached",
  "next_tier_soon",
  "order_confirmed",
  "payment_ready",
  "payment_failed",
  "payment_paid",
  "payment_deposit_completed",
  "shipping_started",
  "shipping_delivered",
  "review_available",
  "refund_updated",
  "support_reply",
  "support_resolved",
  "product_approved",
  "product_rejected",
  "seller_approved",
  "seller_rejected",
  "settlement_ready",
  "settlement_paid",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationChannel = "in_app" | "kakao" | "email" | "push";

export type NotificationRecord = {
  id: string;
  userId: string;
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
