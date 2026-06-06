/** 판매자센터 · DB sellers 테이블 (운영) */
export type SellerStatus =
  | "pending_review"
  | "under_review"
  | "approved"
  | "rejected"
  | "suspended";

export type SellerRecord = {
  id: string;
  userId: string;
  companyName: string;
  businessNumber: string;
  representativeName: string | null;
  businessRegistrationUrl: string | null;
  rejectedReason: string | null;
  status: SellerStatus;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SellerApplicationInput = {
  companyName: string;
  businessNumber: string;
  representativeName: string;
  businessRegistrationUrl?: string | null;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type SellerBankAccountInput = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type SellerProfileInput = {
  companyName: string;
  businessNumber: string;
  representativeName: string;
};

const STATUS_LABELS: Record<SellerStatus, string> = {
  pending_review: "승인 대기",
  under_review: "보완 심사중",
  approved: "승인 완료",
  rejected: "반려",
  suspended: "정지",
};

export function getSellerStatusLabel(status: SellerStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function isSellerStatus(value: string): value is SellerStatus {
  return value in STATUS_LABELS;
}

export function isSellerApproved(status: SellerStatus): boolean {
  return status === "approved";
}

/** 구매자-facing 판매자 프로필 (UI mock / brand_name 기반) */
export type SellerBadgeId =
  | "verified"
  | "popular"
  | "high_repurchase"
  | "fast_response"
  | "best_seller"
  | "new_seller";

export type SellerProfile = {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  repurchaseRate: number;
  inquiryResponseRate: number;
  isVerified: boolean;
  badges: SellerBadgeId[];
  featuredProductSlug: string;
  featuredProductTitle: string;
  productCount: number;
};

export const SELLER_BADGE_LABELS: Record<SellerBadgeId, string> = {
  verified: "인증 판매자",
  popular: "우수 판매자",
  high_repurchase: "재구매 우수",
  fast_response: "응답 우수",
  best_seller: "리뷰 우수",
  new_seller: "신규 입점",
};
