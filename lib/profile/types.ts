import type { VerificationStatus } from "@/lib/identity/verification-status";

export type AccountStatus = "active" | "withdrawal_requested" | "withdrawn" | "suspended";

export type UserGender = "male" | "female" | "other" | null;

/** Client-safe profile (never includes ci_hash / di_hash / billing_key). */
export type UserProfile = {
  userId: string;
  nickname: string | null;
  email: string | null;
  realName: string | null;
  phone: string | null;
  birthDate: string | null;
  gender: UserGender;
  phoneVerifiedAt: string | null;
  verificationStatus: VerificationStatus;
  marketingAgreedAt: string | null;
  accountStatus: AccountStatus;
  withdrawalRequestedAt: string | null;
  memberGrade: string;
  providerLabel: string | null;
};

export type UpdateUserProfileInput = {
  realName: string;
  phone: string;
  nickname?: string;
  birthDate?: string | null;
  gender?: UserGender;
  marketing?: boolean;
};

export type NotificationChannelSettings = {
  kakao: boolean;
  email: boolean;
  push: boolean;
};

export type NotificationSettings = {
  userId: string;
  groupbuyDeadline: boolean;
  tierAchievement: boolean;
  orderShipping: boolean;
  marketing: boolean;
  channels: NotificationChannelSettings;
};

export type UpdateNotificationSettingsInput = {
  groupbuyDeadline?: boolean;
  tierAchievement?: boolean;
  orderShipping?: boolean;
  marketing?: boolean;
  channels?: Partial<NotificationChannelSettings>;
};

export type MypageDashboardSummary = {
  totalOrders: number;
  paymentPendingCount: number;
  shippingCount: number;
  activeGroupBuyCount: number;
  reviewableCount: number;
  pointsBalance: number;
  couponUsageCount: number;
  wishlistCount: number;
  recentViewsCount: number;
  supportOpenCount: number;
};

export type UserCouponUsage = {
  id: string;
  couponCode: string;
  couponName: string;
  discountAmount: number;
  usedAt: string;
};
