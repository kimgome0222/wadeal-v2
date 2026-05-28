import { createAdminNotification } from "@/lib/notifications/unified";
import type { AdminNotificationType } from "@/lib/notifications/types";

async function notifyAdmin(
  type: AdminNotificationType,
  title: string,
  message: string,
  linkUrl?: string | null,
): Promise<void> {
  await createAdminNotification(type, title, message, linkUrl);
}

export async function notifyAdminNewSellerApplication(input: {
  companyName: string;
  sellerId: string;
}): Promise<void> {
  await notifyAdmin(
    "new_seller_application",
    "신규 입점 신청",
    `${input.companyName} 판매자 입점 신청이 접수됐어요.`,
    `/admin/sellers`,
  );
}

export async function notifyAdminNewProductRequest(input: {
  productName: string;
  productId: string;
}): Promise<void> {
  await notifyAdmin(
    "new_product_request",
    "신규 상품 검수",
    `${input.productName} 상품 검수 요청이 접수됐어요.`,
    `/admin/products/${input.productId}/edit`,
  );
}

export async function notifyAdminProductChangeRequest(input: {
  productName: string;
  productId: string;
}): Promise<void> {
  await notifyAdmin(
    "product_change_request",
    "상품 수정 요청",
    `${input.productName} 상품 수정 검수가 필요해요.`,
    `/admin/products/${input.productId}/edit`,
  );
}

export async function notifyAdminRefundRequest(input: {
  orderId: string;
  productName: string;
}): Promise<void> {
  await notifyAdmin(
    "refund_request",
    "환불 요청",
    `${input.productName} 주문 환불 요청을 확인해 주세요.`,
    `/admin/refunds`,
  );
}

export async function notifyAdminEscalatedSupportTicket(input: {
  ticketId: string;
  title: string;
}): Promise<void> {
  await notifyAdmin(
    "escalated_support_ticket",
    "관리자 확인 문의",
    input.title,
    `/admin/support/${input.ticketId}`,
  );
}

export async function notifyAdminPaymentWebhookFailed(input: {
  detail: string;
}): Promise<void> {
  await notifyAdmin(
    "payment_webhook_failed",
    "결제 웹훅 실패",
    input.detail,
    "/admin/payments",
  );
}

export async function notifyAdminCriticalError(input: {
  message: string;
  source?: string | null;
  logId?: string | null;
}): Promise<void> {
  const source = input.source?.trim();
  const logId = input.logId?.trim();
  const linkUrl =
    logId ?
      `/admin/error-logs?level=critical&resolved=open&log=${encodeURIComponent(logId)}`
    : "/admin/error-logs?level=critical&resolved=open";

  await notifyAdmin(
    "critical_error",
    "치명적 오류",
    source ? `[${source}] ${input.message}` : input.message,
    linkUrl,
  );
}

export async function notifyAdminSettlementPending(input: {
  sellerName: string;
  recordId: string;
}): Promise<void> {
  await notifyAdmin(
    "settlement_pending",
    "정산 대기",
    `${input.sellerName} 판매자 정산 확인이 필요해요.`,
    `/admin/settlements/${input.recordId}`,
  );
}

export async function notifyAdminProhibitedKeywordDetected(input: {
  source: string;
  matchedKeywords: string[];
  excerpt: string;
  linkUrl?: string | null;
}): Promise<void> {
  const keywords = input.matchedKeywords.join(", ");
  await notifyAdmin(
    "prohibited_keyword_detected",
    "금지 키워드 감지",
    `[${input.source}] ${keywords} — ${input.excerpt.slice(0, 120)}`,
    input.linkUrl ?? "/admin/products",
  );
}
