export const SELLER_NOTICE_CATEGORIES = [
  "general",
  "settlement",
  "shipping",
  "product",
  "policy",
  "system",
] as const;

export type SellerNoticeCategory = (typeof SELLER_NOTICE_CATEGORIES)[number];

export const SELLER_NOTICE_STATUSES = ["draft", "published", "archived"] as const;

export type SellerNoticeStatus = (typeof SELLER_NOTICE_STATUSES)[number];

const CATEGORY_LABELS: Record<SellerNoticeCategory, string> = {
  general: "일반",
  settlement: "정산",
  shipping: "배송",
  product: "상품",
  policy: "정책",
  system: "시스템",
};

const STATUS_LABELS: Record<SellerNoticeStatus, string> = {
  draft: "임시저장",
  published: "게시됨",
  archived: "보관",
};

export function getSellerNoticeCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category as SellerNoticeCategory] ?? category;
}

export function getSellerNoticeStatusLabel(status: string): string {
  return STATUS_LABELS[status as SellerNoticeStatus] ?? status;
}

export function isSellerNoticeCategory(value: string): value is SellerNoticeCategory {
  return (SELLER_NOTICE_CATEGORIES as readonly string[]).includes(value);
}

export function isSellerNoticeStatus(value: string): value is SellerNoticeStatus {
  return (SELLER_NOTICE_STATUSES as readonly string[]).includes(value);
}
