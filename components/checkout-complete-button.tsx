"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  submitGroupBuyOrderAction,
  submitNormalOrderAction,
} from "@/app/actions/data";
import { getVirtualAccountDepositNotice } from "@/lib/orders/order-flow";
import type { PaymentMethod } from "@/lib/payments/payment-methods";
import { isVirtualAccountMethod } from "@/lib/payments/payment-methods";
import type { PaymentFlow } from "@/lib/payments/payment-flow";
import type { ProductType } from "@/lib/products/product-type";
import { isNormalProduct } from "@/lib/products/product-type";
import { recordActivity } from "@/lib/storage/local-user-data";
import { ui } from "@/lib/ui";

type CheckoutCompleteButtonProps = {
  dealSlug: string;
  productName: string;
  joinedPrice: number;
  currentMembers: number;
  targetMembers: number;
  quantity?: number;
  disabled?: boolean;
  paymentMethod: PaymentMethod | null;
  paymentFlow?: PaymentFlow;
  savedPaymentMethodId?: string | null;
  productType: ProductType;
  couponCode?: string | null;
  pointAmount?: number;
  addressId?: string | null;
  deliveryMemo?: string;
};

export function CheckoutCompleteButton({
  dealSlug,
  productName,
  joinedPrice,
  currentMembers,
  targetMembers,
  quantity = 1,
  disabled = false,
  paymentMethod,
  paymentFlow,
  savedPaymentMethodId,
  productType,
  couponCode = null,
  pointAmount = 0,
  addressId,
  deliveryMemo = "",
}: CheckoutCompleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isNormal = isNormalProduct(productType);

  function handleComplete() {
    if (!paymentMethod) {
      setErrorMessage("결제 수단을 선택해 주세요.");
      return;
    }

    if (!addressId) {
      setErrorMessage("배송지를 선택해 주세요.");
      return;
    }

    setErrorMessage(null);

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

        if (result.error === "profile_incomplete") {
          setErrorMessage("배송지를 등록한 뒤 다시 시도해 주세요.");
          return;
        }

        if (result.error === "orderer_incomplete") {
          setErrorMessage("주문자 이름과 휴대폰 번호를 입력해 주세요.");
          return;
        }

        if (result.error === "invalid_payment_method") {
          setErrorMessage("유효하지 않은 결제 수단이에요.");
          return;
        }

        if (result.error === "auto_pay_card_required") {
          setErrorMessage("자동결제 예약을 위해 카드를 등록해 주세요.");
          return;
        }

        if (result.error === "already_ordered") {
          setErrorMessage(
            isNormal ? "이미 주문한 상품이에요." : "이미 참여한 공동구매예요.",
          );
          return;
        }

        if (result.error === "consent_required") {
          setErrorMessage("필수 약관 동의 후 진행할 수 있어요.");
          return;
        }

        if (result.error === "invalid_coupon" || result.error === "insufficient_points") {
          setErrorMessage(
            result.error === "insufficient_points" ?
              "포인트가 부족해요. 다시 확인해 주세요."
            : "쿠폰을 사용할 수 없어요. 다시 확인해 주세요.",
          );
          return;
        }

        setErrorMessage(
          isNormal ?
            "결제 처리에 실패했어요. 다시 시도해 주세요."
          : "참여 내역 저장에 실패했어요. 다시 시도해 주세요.",
        );
        return;
      }

      if (isNormal && "id" in result && result.id) {
        const paymentRequestPath = `/payment/request/${result.id}`;
        recordActivity({
          type: "join",
          title: "결제 진행",
          description: `${productName} 결제를 진행해 주세요.`,
          href: paymentRequestPath,
        });
        router.push(paymentRequestPath);
        return;
      }

      recordActivity({
        type: "join",
        title: "공동구매 참여",
        description: `${productName} 공동구매에 참여했어요.`,
        href: "/mypage/orders",
      });
      router.push(`/join-complete?id=${encodeURIComponent(dealSlug)}`);
    });
  }

  return (
    <div className="space-y-2">
      {isNormal && paymentMethod && isVirtualAccountMethod(paymentMethod) ?
        <p className="rounded-xl bg-wadeal-surface px-4 py-3 text-center text-[11px] font-bold leading-relaxed text-wadeal-muted">
          {getVirtualAccountDepositNotice()}
        </p>
      : null}
      {errorMessage ?
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-wadeal-red">
          {errorMessage}
        </p>
      : null}
      <button
        className={`${ui.btnPrimary} w-full cursor-pointer`}
        disabled={isPending || disabled}
        onClick={handleComplete}
        type="button"
      >
        {isPending ?
          isNormal ?
            "결제 처리 중..."
          : "저장 중..."
        : isNormal ?
          "결제하기"
        : "공동구매 참여 완료하기"}
      </button>
    </div>
  );
}
