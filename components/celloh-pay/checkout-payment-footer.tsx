"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { CellohPayPasswordSheet } from "@/components/celloh-pay/celloh-pay-password-sheet";
import {
  submitGroupBuyOrderAction,
  submitNormalOrderAction,
} from "@/app/actions/data";
import { useCellohPayCard } from "@/hooks/use-celloh-pay";
import {
  formatCellohPayLabel,
  saveCellohPayOrderResult,
} from "@/lib/celloh-pay/celloh-pay-store";
import { getVirtualAccountDepositNotice } from "@/lib/orders/order-flow";
import type { PaymentMethod } from "@/lib/payments/payment-methods";
import { isVirtualAccountMethod } from "@/lib/payments/payment-methods";
import type { PaymentFlow } from "@/lib/payments/payment-flow";
import type { ProductType } from "@/lib/products/product-type";
import { isNormalProduct } from "@/lib/products/product-type";
import { recordActivity } from "@/lib/storage/local-user-data";
import { currency } from "@/lib/deals";
import type { CheckoutPaymentMode } from "@/components/celloh-pay/celloh-pay-section";

type CheckoutPaymentFooterProps = {
  dealSlug: string;
  productName: string;
  joinedPrice: number;
  currentMembers: number;
  targetMembers: number;
  quantity?: number;
  disabled?: boolean;
  paymentMode: CheckoutPaymentMode;
  paymentMethod: PaymentMethod | null;
  paymentFlow?: PaymentFlow;
  savedPaymentMethodId?: string | null;
  productType: ProductType;
  couponCode?: string | null;
  pointAmount?: number;
  addressId?: string | null;
  deliveryMemo?: string;
  finalTotal: number;
  addressSummary?: string;
};

function buildMockOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  return `CH${stamp}`;
}

function getEstimatedDeliveryLabel() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return `${date.getMonth() + 1}월 ${date.getDate()}일(목) 도착 예정`;
}

/** checkout 하단 고정 결제 버튼 + 셀로페이 비밀번호 flow */
export function CheckoutPaymentFooter({
  dealSlug,
  productName,
  joinedPrice,
  currentMembers,
  targetMembers,
  quantity = 1,
  disabled = false,
  paymentMode,
  paymentMethod,
  paymentFlow,
  savedPaymentMethodId,
  productType,
  couponCode = null,
  pointAmount = 0,
  addressId,
  deliveryMemo = "",
  finalTotal,
  addressSummary = "등록된 배송지",
}: CheckoutPaymentFooterProps) {
  const router = useRouter();
  const cellohCard = useCellohPayCard();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const isNormal = isNormalProduct(productType);
  const isCellohPay = paymentMode === "celloh_pay";
  const payableTotal = Math.max(0, finalTotal);

  const cellohBlocked = isCellohPay && !cellohCard;
  const standardBlocked = !isCellohPay && paymentMethod == null;
  const buttonDisabled = disabled || isPending || cellohBlocked || standardBlocked;

  function getButtonLabel() {
    if (buttonDisabled && payableTotal <= 0) {
      return "상품을 담아주세요";
    }
    if (passwordOpen) {
      return "비밀번호 입력하고 결제하기";
    }
    if (isCellohPay && cellohCard) {
      return `${currency.format(payableTotal)}원 셀로페이로 결제`;
    }
    if (isCellohPay && !cellohCard) {
      return "카드를 등록해 주세요";
    }
    if (isNormal) {
      return `${currency.format(payableTotal)}원 결제하기`;
    }
    return `${currency.format(payableTotal)}원 주문하기`;
  }

  function runStandardCheckout() {
    if (!paymentMethod || !addressId) {
      return;
    }

    startTransition(async () => {
      const payload = {
        productSlug: dealSlug,
        productName,
        joinedPrice,
        currentMembers,
        targetMembers,
        quantity,
        paymentMethod,
        paymentFlow,
        savedPaymentMethodId: savedPaymentMethodId ?? undefined,
        productType,
        couponCode: couponCode ?? undefined,
        pointAmount,
        addressId,
        deliveryMemo,
      };

      const result =
        isNormal ?
          await submitNormalOrderAction(payload)
        : await submitGroupBuyOrderAction(payload);

      if (!result.success) {
        if (result.error === "login_required") {
          router.push(`/login?next=/checkout/${dealSlug}`);
          return;
        }
        setErrorMessage("결제 처리에 실패했어요. 다시 시도해 주세요.");
        return;
      }

      if (isNormal && "id" in result && result.id) {
        router.push(`/payment/request/${result.id}`);
        return;
      }

      recordActivity({
        type: "join",
        title: "상품 구매",
        description: `${productName} 상품을 구매했어요.`,
        href: "/mypage/orders",
      });
      router.push(`/join-complete?id=${encodeURIComponent(dealSlug)}`);
    });
  }

  function runCellohPayMock() {
    if (!cellohCard || !addressId) {
      return;
    }

    startTransition(async () => {
      saveCellohPayOrderResult({
        orderNumber: buildMockOrderNumber(),
        amount: payableTotal,
        paymentLabel: formatCellohPayLabel(cellohCard),
        addressSummary,
        estimatedDelivery: getEstimatedDeliveryLabel(),
        productName,
      });

      recordActivity({
        type: "join",
        title: "셀로페이 주문",
        description: `${productName} 주문이 완료되었어요.`,
        href: "/mypage/orders",
      });

      setPasswordOpen(false);
      router.push("/checkout/success");
    });
  }

  function handlePrimaryClick() {
    setErrorMessage(null);

    if (!addressId) {
      setErrorMessage("배송지를 선택해 주세요.");
      return;
    }

    if (isCellohPay) {
      if (!cellohCard) {
        setErrorMessage("셀로페이 카드를 등록해 주세요.");
        return;
      }
      setPasswordOpen(true);
      return;
    }

    if (!paymentMethod) {
      setErrorMessage("결제 수단을 선택해 주세요.");
      return;
    }

    runStandardCheckout();
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[110] mx-auto max-w-[430px] border-t border-[#E8ECEA] bg-white px-5 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        {errorMessage ?
          <p className="mb-2 rounded-xl bg-[#FFF4E8] px-3 py-2 text-center text-[12px] font-semibold text-[#E28A3B]">
            {errorMessage}
          </p>
        : null}
        {!isCellohPay && paymentMethod && isVirtualAccountMethod(paymentMethod) ?
          <p className="mb-2 text-center text-[11px] leading-relaxed text-[#666666]">
            {getVirtualAccountDepositNotice()}
          </p>
        : null}
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[14px] font-medium text-[#666666]">결제예정금액</p>
          <p className="text-[18px] font-bold tabular-nums text-[#111111]">
            {currency.format(payableTotal)}원
          </p>
        </div>
        <button
          className={`flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl text-[16px] font-bold transition-colors duration-[100ms] ${
            buttonDisabled ?
              "cursor-not-allowed bg-[#E8ECEA] text-[#999999]"
            : "bg-[#2E5E4E] text-white active:opacity-90"
          }`}
          disabled={buttonDisabled}
          onClick={handlePrimaryClick}
          type="button"
        >
          {isPending ? "결제 처리 중..." : getButtonLabel()}
        </button>
      </div>

      <CellohPayPasswordSheet
        isProcessing={isPending}
        onClose={() => setPasswordOpen(false)}
        onConfirm={runCellohPayMock}
        open={passwordOpen}
      />
    </>
  );
}
