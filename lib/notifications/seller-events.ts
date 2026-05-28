import { getSellerByUserId } from "@/lib/data/sellers";
import { createSellerNotification } from "@/lib/notifications/unified";
import type { SellerNotificationType } from "@/lib/notifications/types";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

async function notifySellerByUserId(
  sellerUserId: string,
  type: SellerNotificationType,
  title: string,
  message: string,
  linkUrl?: string | null,
): Promise<void> {
  const seller = await getSellerByUserId(sellerUserId);
  if (!seller) {
    return;
  }

  await createSellerNotification(seller.id, type, title, message, linkUrl);
}

export async function notifySellerApplicationApproved(input: {
  sellerId: string;
  companyName: string;
}): Promise<void> {
  await createSellerNotification(
    input.sellerId,
    "seller_application_approved",
    "입점 승인",
    `${input.companyName} 판매자 입점이 승인됐어요.`,
    "/seller/dashboard",
  );
}

export async function notifySellerApplicationRejected(input: {
  sellerId: string;
  companyName: string;
  reason?: string | null;
}): Promise<void> {
  const reason = input.reason?.trim();
  await createSellerNotification(
    input.sellerId,
    "seller_application_rejected",
    "입점 반려",
    reason ?
      `${input.companyName} 입점 신청이 반려됐어요. 사유: ${reason}`
    : `${input.companyName} 입점 신청이 반려됐어요.`,
    "/seller/settings",
  );
}

export async function notifySellerAccountSuspended(input: {
  sellerId: string;
  companyName: string;
}): Promise<void> {
  await createSellerNotification(
    input.sellerId,
    "seller_application_rejected",
    "계정 정지",
    `${input.companyName} 판매자 계정이 정지됐어요. 문의가 필요하면 고객센터로 연락해 주세요.`,
    "/seller/suspended",
  );
}

export async function notifySellerProductApproved(input: {
  sellerUserId: string;
  productName: string;
  productId: string;
}): Promise<void> {
  await notifySellerByUserId(
    input.sellerUserId,
    "product_request_approved",
    "상품 승인",
    `${input.productName} 상품이 승인되어 노출됩니다.`,
    "/seller/products",
  );
}

export async function notifySellerProductRejected(input: {
  sellerUserId: string;
  productName: string;
  reason: string;
}): Promise<void> {
  await notifySellerByUserId(
    input.sellerUserId,
    "product_request_rejected",
    "상품 반려",
    `${input.productName} 검수가 반려됐어요. 사유: ${input.reason}`,
    "/seller/products",
  );
}

export async function notifySellerNewOrder(input: {
  sellerUserId: string;
  productName: string;
  orderId: string;
}): Promise<void> {
  await notifySellerByUserId(
    input.sellerUserId,
    "new_order_received",
    "신규 주문",
    `${input.productName} 주문이 접수됐어요.`,
    `/seller/orders/${input.orderId}`,
  );
}

export async function notifySellerShippingRequired(input: {
  sellerUserId: string;
  productName: string;
  orderId: string;
}): Promise<void> {
  await notifySellerByUserId(
    input.sellerUserId,
    "shipping_required",
    "송장 입력 필요",
    `${input.productName} 주문의 송장을 입력해 주세요.`,
    `/seller/orders/${input.orderId}`,
  );
}

export async function notifySellerSettlementConfirmed(input: {
  sellerId: string;
  periodLabel: string;
  recordId?: string | null;
}): Promise<void> {
  const linkUrl =
    input.recordId ?
      `/seller/finance/settlements?record=${input.recordId}`
    : "/seller/finance/settlements";

  await createSellerNotification(
    input.sellerId,
    "settlement_confirmed",
    "정산 확정",
    `${input.periodLabel} 정산이 확정됐어요.`,
    linkUrl,
  );
}

export async function notifySellerSettlementPaid(input: {
  sellerId: string;
  amount: number;
  receiptReference?: string | null;
}): Promise<void> {
  await createSellerNotification(
    input.sellerId,
    "settlement_paid",
    "정산금 입금 완료",
    `${new Intl.NumberFormat("ko-KR").format(input.amount)}원이 입금됐어요.${
      input.receiptReference ? ` (영수증: ${input.receiptReference})` : ""
    }`,
    "/seller/finance/settlements",
  );
}

export async function notifySellerSettlementReady(input: {
  sellerId: string;
  periodLabel: string;
  recordId?: string | null;
}): Promise<void> {
  const linkUrl =
    input.recordId ?
      `/seller/finance/settlements?record=${input.recordId}`
    : "/seller/finance/settlements";

  await createSellerNotification(
    input.sellerId,
    "settlement_ready",
    "정산 내역 생성",
    `${input.periodLabel} 정산 내역을 확인해 주세요.`,
    linkUrl,
  );
}

export async function notifySellerNewProductQuestion(input: {
  sellerUserId: string;
  productName: string;
  ticketId: string;
}): Promise<void> {
  await notifySellerByUserId(
    input.sellerUserId,
    "new_product_question",
    "상품 문의",
    `${input.productName} 상품에 새 문의가 등록됐어요.`,
    "/seller/cs-reviews",
  );
}

export async function notifySellerNewReview(input: {
  sellerUserId: string;
  productName: string;
  rating: number;
}): Promise<void> {
  await notifySellerByUserId(
    input.sellerUserId,
    "new_review",
    "신규 리뷰",
    `${input.productName} 상품에 ${input.rating}점 리뷰가 등록됐어요.`,
    "/seller/cs-reviews",
  );
}

export async function notifySellerProductChangesRequested(input: {
  sellerUserId: string;
  productName: string;
  reason: string;
}): Promise<void> {
  await notifySellerByUserId(
    input.sellerUserId,
    "product_changes_requested",
    "상품 수정 요청",
    `${input.productName} 상품 수정이 필요해요. 사유: ${input.reason}`,
    "/seller/products",
  );
}

export async function notifySellerNoticePublished(input: {
  sellerId: string;
  title: string;
  noticeId: string;
}): Promise<void> {
  await createSellerNotification(
    input.sellerId,
    "seller_notice_published",
    "판매자 공지",
    input.title,
    `/seller/notices/${input.noticeId}`,
  );
}

export async function notifyAllSellersNoticePublished(input: {
  noticeId: string;
  title: string;
}): Promise<void> {
  const { getApprovedSellerIds } = await import("@/lib/data/seller-notices");
  const sellerIds = await getApprovedSellerIds();
  await Promise.all(
    sellerIds.map((sellerId) =>
      notifySellerNoticePublished({
        sellerId,
        title: input.title,
        noticeId: input.noticeId,
      }),
    ),
  );
}

export async function notifySellerOnOrderPaid(input: {
  orderId: string;
  productId: string;
  productName: string;
  shippingPreparing?: boolean;
}): Promise<void> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return;
  }

  const { data } = await supabase
    .from("products")
    .select("created_by")
    .eq("id", input.productId)
    .maybeSingle();

  const sellerUserId = (data as { created_by: string | null } | null)?.created_by;
  if (!sellerUserId) {
    return;
  }

  await notifySellerNewOrder({
    sellerUserId,
    productName: input.productName,
    orderId: input.orderId,
  });

  if (input.shippingPreparing) {
    await notifySellerShippingRequired({
      sellerUserId,
      productName: input.productName,
      orderId: input.orderId,
    });
  }
}
