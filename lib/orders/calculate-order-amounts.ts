import { calculateShippingFee } from "@/lib/shipping/calculate-shipping-fee";
import type { AddressForShipping, ProductShippingProfile } from "@/lib/shipping/types";

export type OrderAmountInput = {
  unitPrice: number;
  quantity: number;
  product: ProductShippingProfile;
  address?: AddressForShipping | null;
  couponDiscount?: number;
  pointsUsed?: number;
};

export type OrderAmountBreakdown = {
  subtotalAmount: number;
  shippingFee: number;
  remoteAreaExtraFee: number;
  couponDiscount: number;
  pointsUsed: number;
  finalPaymentAmount: number;
  shipping: ReturnType<typeof calculateShippingFee>;
};

export function calculateOrderAmounts(input: OrderAmountInput): OrderAmountBreakdown {
  const quantity = Math.max(1, Math.round(input.quantity));
  const unitPrice = Math.max(0, Math.round(input.unitPrice));
  const subtotalAmount = unitPrice * quantity;
  const couponDiscount = Math.max(0, Math.round(input.couponDiscount ?? 0));
  const pointsUsed = Math.max(0, Math.round(input.pointsUsed ?? 0));

  const shipping = calculateShippingFee({
    product: input.product,
    address: input.address,
    subtotal: subtotalAmount,
    quantity,
  });

  const discountTotal = Math.min(subtotalAmount, couponDiscount + pointsUsed);
  const finalPaymentAmount = Math.max(
    0,
    subtotalAmount - discountTotal + shipping.totalShippingFee,
  );

  return {
    subtotalAmount,
    shippingFee: shipping.baseShippingFee,
    remoteAreaExtraFee: shipping.remoteExtraFee,
    couponDiscount,
    pointsUsed,
    finalPaymentAmount,
    shipping,
  };
}
