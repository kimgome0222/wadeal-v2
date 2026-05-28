import { validateCoupon } from "@/lib/discounts/coupon";
import { getMaxUsablePoints, getPointBalance } from "@/lib/discounts/points";
import type {
  DiscountPreviewInput,
  DiscountPreviewResult,
  OrderDiscountBreakdown,
} from "@/lib/discounts/types";

const COUPON_ERROR_MESSAGES: Record<string, string> = {
  coupon_not_found: "존재하지 않는 쿠폰 코드예요.",
  coupon_inactive: "사용할 수 없는 쿠폰이에요.",
  coupon_not_started: "아직 사용 기간이 시작되지 않았어요.",
  coupon_expired: "만료된 쿠폰이에요.",
  min_order_not_met: "최소 주문 금액을 충족하지 못했어요.",
  usage_limit_exceeded: "쿠폰 사용 한도가 초과됐어요.",
  per_user_limit_exceeded: "이미 사용한 쿠폰이에요.",
  coupon_already_reserved: "다른 주문에 적용 중인 쿠폰이에요.",
  invalid_subtotal: "주문 금액을 확인할 수 없어요.",
};

export function buildOrderDiscountBreakdown(input: {
  subtotalAmount: number;
  couponDiscountAmount: number;
  pointDiscountAmount: number;
  shippingFee: number;
  couponId?: string | null;
  couponCode?: string | null;
  couponName?: string | null;
  couponDiscountType?: OrderDiscountBreakdown["couponDiscountType"];
}): OrderDiscountBreakdown {
  const subtotal = Math.max(0, Math.round(input.subtotalAmount));
  const couponDiscount = Math.max(0, Math.round(input.couponDiscountAmount));
  const pointDiscount = Math.max(0, Math.round(input.pointDiscountAmount));
  const shipping = Math.max(0, Math.round(input.shippingFee));
  const finalPayment = Math.max(subtotal - couponDiscount - pointDiscount + shipping, 0);

  return {
    subtotalAmount: subtotal,
    couponDiscountAmount: couponDiscount,
    pointDiscountAmount: pointDiscount,
    shippingFee: shipping,
    finalPaymentAmount: finalPayment,
    couponId: input.couponId ?? null,
    couponCode: input.couponCode ?? null,
    couponName: input.couponName ?? null,
    couponDiscountType: input.couponDiscountType ?? null,
  };
}

export async function calculateOrderTotal(
  input: DiscountPreviewInput,
): Promise<DiscountPreviewResult> {
  const subtotal = Math.max(0, Math.round(input.subtotalAmount));
  const shippingFee = Math.max(0, Math.round(input.shippingFee ?? 0));

  let couponDiscount = 0;
  let couponId: string | null = null;
  let couponCode: string | null = null;
  let couponName: string | null = null;
  let couponDiscountType: OrderDiscountBreakdown["couponDiscountType"] = null;

  if (input.couponCode?.trim()) {
    const couponResult = await validateCoupon({
      userId: input.userId,
      couponCode: input.couponCode,
      subtotalAmount: subtotal,
      orderId: input.orderId,
    });

    if (!couponResult.success) {
      return {
        success: false,
        error: couponResult.error,
        message: COUPON_ERROR_MESSAGES[couponResult.error],
      };
    }

    couponDiscount = couponResult.coupon.discountAmount;
    couponId = couponResult.coupon.couponId;
    couponCode = couponResult.coupon.couponCode;
    couponName = couponResult.coupon.couponName;
    couponDiscountType = couponResult.coupon.discountType;

    if (couponResult.coupon.discountType === "free_shipping") {
      // free_shipping handled via shipping fee = 0
    }
  }

  const subtotalAfterCoupon = Math.max(subtotal - couponDiscount, 0);
  const balance = await getPointBalance(input.userId);
  const maxUsable = getMaxUsablePoints(subtotalAfterCoupon, balance);
  const requestedPoints = Math.max(0, Math.round(input.pointAmount ?? 0));

  if (requestedPoints > maxUsable) {
    return {
      success: false,
      error: "insufficient_points",
      message:
        maxUsable < balance ?
          `최대 ${maxUsable.toLocaleString()}P까지 사용할 수 있어요.`
        : `보유 포인트(${balance.toLocaleString()}P)가 부족해요.`,
    };
  }

  const effectiveShipping =
    couponDiscountType === "free_shipping" ? 0 : shippingFee;

  return {
    success: true,
    breakdown: buildOrderDiscountBreakdown({
      subtotalAmount: subtotal,
      couponDiscountAmount: couponDiscount,
      pointDiscountAmount: requestedPoints,
      shippingFee: effectiveShipping,
      couponId,
      couponCode,
      couponName,
      couponDiscountType,
    }),
  };
}
