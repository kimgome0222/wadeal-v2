import { calculateOrderTotal } from "@/lib/discounts/calculate-order-total";
import {
  commitDiscounts,
  reservePoints,
  rollbackDiscounts,
} from "@/lib/discounts/points";
import type { OrderDiscountBreakdown } from "@/lib/discounts/types";
import { shouldChargeImmediately } from "@/lib/orders/order-flow";

export type ApplyDiscountsToOrderInput = {
  userId: string;
  orderId: string;
  subtotalAmount: number;
  couponCode?: string | null;
  pointAmount?: number;
  shippingFee?: number;
  productType: string;
  commitImmediately?: boolean;
};

export type ApplyDiscountsToOrderResult =
  | { success: true; breakdown: OrderDiscountBreakdown }
  | { success: false; error: string; message?: string };

export async function applyDiscountsToOrder(
  input: ApplyDiscountsToOrderInput,
): Promise<ApplyDiscountsToOrderResult> {
  const preview = await calculateOrderTotal({
    userId: input.userId,
    subtotalAmount: input.subtotalAmount,
    couponCode: input.couponCode,
    pointAmount: input.pointAmount,
    shippingFee: input.shippingFee ?? 0,
    orderId: input.orderId,
  });

  if (!preview.success) {
    return {
      success: false,
      error: preview.error,
      message: preview.message,
    };
  }

  const { breakdown } = preview;

  if (breakdown.pointDiscountAmount > 0) {
    const reserveResult = await reservePoints({
      userId: input.userId,
      amount: breakdown.pointDiscountAmount,
      orderId: input.orderId,
    });

    if (!reserveResult.success) {
      return {
        success: false,
        error: reserveResult.error ?? "save_failed",
        message: "포인트 사용에 실패했어요.",
      };
    }
  }

  const commitNow =
    input.commitImmediately ?? shouldChargeImmediately(input.productType);

  if (commitNow) {
    const commitResult = await commitDiscounts(input.orderId);
    if (!commitResult.success) {
      await rollbackDiscounts(input.orderId);
      return {
        success: false,
        error: "save_failed",
        message: "할인 적용에 실패했어요.",
      };
    }
  }

  return { success: true, breakdown };
}

export async function recalculateDiscountsForFinalize(input: {
  userId: string;
  orderId: string;
  newSubtotalAmount: number;
  couponCode?: string | null;
  pointAmountReserved: number;
  shippingFee?: number;
}): Promise<ApplyDiscountsToOrderResult> {
  const preview = await calculateOrderTotal({
    userId: input.userId,
    subtotalAmount: input.newSubtotalAmount,
    couponCode: input.couponCode,
    pointAmount: input.pointAmountReserved,
    shippingFee: input.shippingFee ?? 0,
    orderId: input.orderId,
  });

  if (!preview.success) {
    // Coupon no longer valid at finalize — clear coupon, keep points adjusted
    const fallback = await calculateOrderTotal({
      userId: input.userId,
      subtotalAmount: input.newSubtotalAmount,
      couponCode: null,
      pointAmount: input.pointAmountReserved,
      shippingFee: input.shippingFee ?? 0,
      orderId: input.orderId,
    });

    if (!fallback.success) {
      const pointsOnly = await calculateOrderTotal({
        userId: input.userId,
        subtotalAmount: input.newSubtotalAmount,
        couponCode: null,
        pointAmount: 0,
        shippingFee: input.shippingFee ?? 0,
        orderId: input.orderId,
      });

      return pointsOnly.success ?
          { success: true, breakdown: pointsOnly.breakdown }
        : {
            success: false,
            error: preview.error,
            message: preview.message,
          };
    }

    return { success: true, breakdown: fallback.breakdown };
  }

  return { success: true, breakdown: preview.breakdown };
}
