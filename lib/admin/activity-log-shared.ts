import type { Json } from "@/lib/database/types";

export const ADMIN_ACTIONS = {
  PRODUCT_CREATE: "product_create",
  PRODUCT_UPDATE: "product_update",
  PRODUCT_APPROVE: "product_approve",
  PRODUCT_REJECT: "product_reject",
  SELLER_APPROVE: "seller_approve",
  SELLER_REJECT: "seller_reject",
  ORDER_STATUS_UPDATE: "order_status_update",
  PAYMENT_STATUS_UPDATE: "payment_status_update",
  REFUND_UPDATE: "refund_update",
  SHIPPING_UPDATE: "shipping_update",
  REVIEW_HIDE: "review_hide",
  REVIEW_DELETE: "review_delete",
  SUPPORT_REPLY: "support_reply",
  SETTLEMENT_CONFIRM: "settlement_confirm",
  SETTLEMENT_PAID: "settlement_paid",
  BUSINESS_SETTINGS_UPDATE: "business_settings_update",
  SELLER_NOTICE_CREATE: "admin_seller_notice_create",
  SELLER_NOTICE_UPDATE: "admin_seller_notice_update",
  SELLER_NOTICE_PUBLISH: "admin_seller_notice_publish",
  SELLER_NOTICE_ARCHIVE: "admin_seller_notice_archive",
} as const;

export type AdminAction = (typeof ADMIN_ACTIONS)[keyof typeof ADMIN_ACTIONS];

export const ADMIN_TARGET_TYPES = {
  PRODUCT: "product",
  ORDER: "order",
  PAYMENT: "payment",
  REVIEW: "review",
  SUPPORT_TICKET: "support_ticket",
  SETTLEMENT: "settlement",
  SUPPLIER: "supplier",
  SELLER: "seller",
  BUSINESS_SETTINGS: "business_settings",
  SELLER_NOTICE: "seller_notice",
} as const;

export type AdminTargetType = (typeof ADMIN_TARGET_TYPES)[keyof typeof ADMIN_TARGET_TYPES];

const SENSITIVE_KEY_PATTERN =
  /^(billing_key|secret|ci_hash|di_hash|password|token|access_token|refresh_token|payment_key|raw_response|api_key|private_key|client_secret)$/i;

const SENSITIVE_SUBSTRING_PATTERN =
  /(billing_key|secret|ci_hash|di_hash|password|token|payment_key|raw_response|api_key|private_key|client_secret)/i;

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERN.test(key) || SENSITIVE_SUBSTRING_PATTERN.test(key);
}

export function sanitizeLogData(data: unknown): Json | null {
  if (data === null || data === undefined) {
    return null;
  }

  if (typeof data !== "object") {
    return data as Json;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item)) as Json;
  }

  const result: Record<string, Json | undefined> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (isSensitiveKey(key)) {
      continue;
    }

    if (value !== null && typeof value === "object") {
      result[key] = sanitizeLogData(value) ?? null;
      continue;
    }

    result[key] = value as Json;
  }

  return result;
}

export const ADMIN_ACTION_LABELS: Record<AdminAction, string> = {
  product_create: "상품 등록",
  product_update: "상품 수정",
  product_approve: "상품 승인",
  product_reject: "상품 반려",
  seller_approve: "판매자 승인",
  seller_reject: "판매자 반려",
  order_status_update: "주문 상태 변경",
  payment_status_update: "결제 상태 변경",
  refund_update: "환불 처리",
  shipping_update: "배송 상태 변경",
  review_hide: "리뷰 숨김",
  review_delete: "리뷰 삭제",
  support_reply: "고객센터 답변",
  settlement_confirm: "정산 확정",
  settlement_paid: "정산 지급 완료",
  business_settings_update: "사업자 정보 변경",
  admin_seller_notice_create: "판매자 공지 등록",
  admin_seller_notice_update: "판매자 공지 수정",
  admin_seller_notice_publish: "판매자 공지 게시",
  admin_seller_notice_archive: "판매자 공지 보관",
};

export const ADMIN_TARGET_TYPE_LABELS: Record<AdminTargetType, string> = {
  product: "상품",
  order: "주문",
  payment: "결제",
  review: "리뷰",
  support_ticket: "고객센터",
  settlement: "정산",
  supplier: "공급사",
  seller: "판매자",
  business_settings: "사업자 정보",
  seller_notice: "판매자 공지",
};

export function getAdminActionLabel(action: string): string {
  return ADMIN_ACTION_LABELS[action as AdminAction] ?? action;
}

export function getAdminTargetTypeLabel(targetType: string): string {
  return ADMIN_TARGET_TYPE_LABELS[targetType as AdminTargetType] ?? targetType;
}

export function getAdminTargetHref(targetType: string, targetId: string): string | null {
  switch (targetType) {
    case ADMIN_TARGET_TYPES.PRODUCT:
      return `/admin/products/${targetId}/edit`;
    case ADMIN_TARGET_TYPES.ORDER:
      return `/admin/orders?order=${targetId}`;
    case ADMIN_TARGET_TYPES.PAYMENT:
      return `/admin/payments`;
    case ADMIN_TARGET_TYPES.REVIEW:
      return `/admin/reviews`;
    case ADMIN_TARGET_TYPES.SUPPORT_TICKET:
      return `/admin/support/${targetId}`;
    case ADMIN_TARGET_TYPES.SETTLEMENT:
      return `/admin/settlements/${targetId}`;
    case ADMIN_TARGET_TYPES.SUPPLIER:
      return `/admin/suppliers/${targetId}/edit`;
    case ADMIN_TARGET_TYPES.SELLER:
      return `/admin/verification?tab=sellers`;
    case ADMIN_TARGET_TYPES.BUSINESS_SETTINGS:
      return `/admin/settings/business`;
    case ADMIN_TARGET_TYPES.SELLER_NOTICE:
      return `/admin/seller-notices/${targetId}/edit`;
    default:
      return null;
  }
}
