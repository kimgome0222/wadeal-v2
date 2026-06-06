import { createNotification } from "@/lib/notifications/create";

export async function notifyOrderConfirmed(input: {
  userId: string;
  productName: string;
  finalAmount: number;
  orderId: string;
}): Promise<void> {
  await createNotification(
    input.userId,
    "order_confirmed",
    "구매 확정",
    `${input.productName} · ${input.finalAmount.toLocaleString("ko-KR")}원`,
    "/mypage/orders",
  );
}

export async function notifyPaymentReady(input: {
  userId: string;
  productName: string;
  amount: number;
  orderId: string;
}): Promise<void> {
  await createNotification(
    input.userId,
    "payment_ready",
    "결제 준비 완료",
    `${input.productName} · ${input.amount.toLocaleString("ko-KR")}원 결제 가능`,
    `/payment/request/${input.orderId}`,
  );
}

export async function notifyPaymentFailed(input: {
  userId: string;
  productName: string;
  amount: number;
  checkoutSlug: string;
}): Promise<void> {
  await createNotification(
    input.userId,
    "payment_failed",
    "자동결제 실패",
    `${input.productName} · ${input.amount.toLocaleString("ko-KR")}원 · 직접 결제가 필요해요`,
    `/mypage/orders`,
  );
}

export async function notifyPaymentPaid(input: {
  userId: string;
  productName: string;
  amount: number;
}): Promise<void> {
  await createNotification(
    input.userId,
    "payment_paid",
    "결제 완료",
    `${input.productName} · ${input.amount.toLocaleString("ko-KR")}원`,
    "/mypage/orders",
  );
}

export async function notifyShippingStarted(input: {
  userId: string;
  productName: string;
  courierCompany?: string | null;
}): Promise<void> {
  const courier = input.courierCompany?.trim();
  await createNotification(
    input.userId,
    "shipping_started",
    "배송 시작",
    courier ?
      `${input.productName} · ${courier} 배송 중`
    : `${input.productName} · 배송이 시작됐어요`,
    "/mypage/orders",
  );
}

export async function notifyShippingDelivered(input: {
  userId: string;
  productName: string;
}): Promise<void> {
  await createNotification(
    input.userId,
    "shipping_delivered",
    "배송 완료",
    `${input.productName} · 수령 후 구매 확정해 주세요`,
    "/mypage/orders",
  );
}

export async function notifyReviewAvailable(input: {
  userId: string;
  productName: string;
  productId: string;
}): Promise<void> {
  await createNotification(
    input.userId,
    "review_available",
    "리뷰 작성 가능",
    `${input.productName} · 구매 확정 완료`,
    `/product/${input.productId}`,
  );
}

export async function notifyRefundUpdated(input: {
  userId: string;
  productName: string;
}): Promise<void> {
  await createNotification(
    input.userId,
    "refund_updated",
    "환불 처리",
    `${input.productName} · 환불 상태가 업데이트됐어요`,
    "/mypage/orders",
  );
}
