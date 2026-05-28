export {
  createNotification,
  getUnreadNotificationCount,
  markNotificationAsRead,
  notifyDealParticipants,
  type CreateNotificationInput,
  type CreateNotificationResult,
  type MarkNotificationReadResult,
  type NotifyDealParticipantsPayload,
} from "@/lib/notifications/create";

export {
  checkDealPriceTierNotifications,
  notifyNextTierSoon,
  notifyPriceTierReached,
} from "@/lib/notifications/price-tier";

export {
  notifyDealDeadlineSoon,
  notifyDealsDeadlineSoon,
  type DeadlineSoonWindow,
} from "@/lib/notifications/deadline";

export {
  notifyOrderConfirmed,
  notifyPaymentFailed,
  notifyPaymentPaid,
  notifyPaymentReady,
  notifyRefundUpdated,
  notifyReviewAvailable,
  notifyShippingDelivered,
  notifyShippingStarted,
} from "@/lib/notifications/order-events";

export {
  notifySupportReply,
  notifySupportResolved,
} from "@/lib/notifications/support-events";

export {
  isNotificationType,
  NOTIFICATION_TYPES,
  type NotificationChannel,
  type NotificationRecord,
  type NotificationType,
} from "@/lib/notifications/types";
