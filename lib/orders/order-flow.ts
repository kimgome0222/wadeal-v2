import type { PaymentMethod } from "@/lib/payments/payment-methods";
import { isVirtualAccountMethod } from "@/lib/payments/payment-methods";
import {
  isGroupBuyProduct,
  isNormalProduct,
  type ProductType,
} from "@/lib/products/product-type";
import { JOIN_ORDER_STATUSES, type PaymentStatus } from "@/lib/orders/order-status";

export type OrderFlowInitialState = {
  orderStatus: string;
  paymentStatus: PaymentStatus;
  shippingStatus: string;
  productType: ProductType;
};

/** Statuses when a user joins a group buy (payment deferred until finalize). */
export function getGroupBuyJoinState(_paymentMethod: PaymentMethod): OrderFlowInitialState {
  return {
    orderStatus: JOIN_ORDER_STATUSES.orderStatus,
    paymentStatus: JOIN_ORDER_STATUSES.paymentStatus,
    shippingStatus: JOIN_ORDER_STATUSES.shippingStatus,
    productType: "groupbuy",
  };
}

/** Statuses when a normal product order is created (PG payment follows on /payment/request). */
export function getNormalCheckoutState(_paymentMethod: PaymentMethod): OrderFlowInitialState {
  return {
    orderStatus: "pending",
    paymentStatus: "ready",
    shippingStatus: "none",
    productType: "normal",
  };
}

export function resolveOrderFlow(
  productType: string | null | undefined,
  paymentMethod: PaymentMethod,
): OrderFlowInitialState {
  if (isNormalProduct(productType)) {
    return getNormalCheckoutState(paymentMethod);
  }

  return getGroupBuyJoinState(paymentMethod);
}

export function shouldChargeImmediately(productType: string | null | undefined): boolean {
  return isNormalProduct(productType);
}

export function canIssueVirtualAccountAfterFinalize(
  productType: string | null | undefined,
  paymentMethod: string | null | undefined,
): boolean {
  return isGroupBuyProduct(productType) && isVirtualAccountMethod(paymentMethod);
}

export function getVirtualAccountDepositNotice(): string {
  return "가상계좌 입금 기한 내 미입금 시 주문이 자동 취소될 수 있어요. 입금 확인 후 배송 준비가 시작돼요.";
}
