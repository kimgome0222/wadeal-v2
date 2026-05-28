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
  createAdminNotification,
  createSellerNotification,
  createUserNotification,
  getUnreadCountByRole,
} from "@/lib/notifications/unified";

export {
  notifyAdminCriticalError,
  notifyAdminEscalatedSupportTicket,
  notifyAdminNewProductRequest,
  notifyAdminNewSellerApplication,
  notifyAdminPaymentWebhookFailed,
  notifyAdminProhibitedKeywordDetected,
  notifyAdminProductChangeRequest,
  notifyAdminRefundRequest,
  notifyAdminSettlementPending,
} from "@/lib/notifications/admin-events";

export {
  notifySellerApplicationApproved,
  notifySellerApplicationRejected,
  notifySellerNewOrder,
  notifySellerNewProductQuestion,
  notifySellerNewReview,
  notifySellerNoticePublished,
  notifySellerProductApproved,
  notifySellerProductChangesRequested,
  notifySellerProductRejected,
  notifySellerSettlementConfirmed,
  notifySellerSettlementPaid,
  notifySellerSettlementReady,
  notifySellerShippingRequired,
} from "@/lib/notifications/seller-events";

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
  NOTIFICATION_TARGET_ROLES,
  USER_NOTIFICATION_TYPES,
  SELLER_NOTIFICATION_TYPES,
  ADMIN_NOTIFICATION_TYPES,
  getNotificationTypeLabel,
  type AdminNotificationType,
  type NotificationChannel,
  type NotificationRecord,
  type NotificationTargetRole,
  type NotificationType,
  type SellerNotificationType,
  type UserNotificationType,
} from "@/lib/notifications/types";
