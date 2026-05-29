"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { validateAndPreviewDiscountsAction } from "@/app/actions/discounts";
import type { OrderDiscountBreakdown } from "@/lib/discounts/types";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type CheckoutDiscountSectionProps = {
  subtotalAmount: number;
  shippingFee?: number;
  onBreakdownChange: (breakdown: OrderDiscountBreakdown | null) => void;
  disabled?: boolean;
};

export function CheckoutDiscountSection({
  subtotalAmount,
  shippingFee = 0,
  onBreakdownChange,
  disabled = false,
}: CheckoutDiscountSectionProps) {
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [pointInput, setPointInput] = useState("");
  const [pointBalance, setPointBalance] = useState(0);
  const [maxUsablePoints, setMaxUsablePoints] = useState(0);
  const [breakdown, setBreakdown] = useState<OrderDiscountBreakdown | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const refreshPreview = useCallback(
    (couponCode: string | null, pointAmount: number) => {
      startTransition(async () => {
        setErrorMessage(null);
        const result = await validateAndPreviewDiscountsAction({
          subtotalAmount,
          couponCode,
          pointAmount,
          shippingFee,
        });

        if (!result.success) {
          setErrorMessage(result.message ?? "할인 적용에 실패했어요.");
          onBreakdownChange(null);
          return;
        }

        setBreakdown(result.breakdown);
        setPointBalance(result.pointBalance);
        setMaxUsablePoints(result.maxUsablePoints);
        onBreakdownChange(result.breakdown);
      });
    },
    [subtotalAmount, shippingFee, onBreakdownChange],
  );

  useEffect(() => {
    refreshPreview(appliedCouponCode, 0);
  }, [subtotalAmount, appliedCouponCode, refreshPreview]);

  function handleApplyCoupon() {
    const code = couponInput.trim();
    if (!code) {
      setErrorMessage("쿠폰 코드를 입력해 주세요.");
      return;
    }

    setAppliedCouponCode(code);
    const points = Number(pointInput.replace(/[^\d]/g, "")) || 0;
    refreshPreview(code, points);
  }

  function handleRemoveCoupon() {
    setAppliedCouponCode(null);
    setCouponInput("");
    const points = Number(pointInput.replace(/[^\d]/g, "")) || 0;
    refreshPreview(null, points);
  }

  function handleApplyPoints() {
    const points = Number(pointInput.replace(/[^\d]/g, "")) || 0;
    refreshPreview(appliedCouponCode, points);
  }

  function handleUseAllPoints() {
    setPointInput(String(maxUsablePoints));
    refreshPreview(appliedCouponCode, maxUsablePoints);
  }

  const displayBreakdown = breakdown ?? {
    subtotalAmount,
    couponDiscountAmount: 0,
    pointDiscountAmount: 0,
    shippingFee,
    finalPaymentAmount: subtotalAmount + shippingFee,
    couponId: null,
    couponCode: null,
    couponName: null,
    couponDiscountType: null,
  };

  return (
    <article className="rounded-xl border border-wadeal-line bg-white p-4">
      <h2 className={ui.sectionTitle}>쿠폰 · 포인트</h2>

      <div className="mt-3 space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-bold text-wadeal-muted" htmlFor="coupon-code">
            쿠폰 코드
          </label>
          <div className="flex gap-2">
            <input
              className={`${ui.input} h-10 flex-1 text-sm`}
              disabled={disabled || isPending || appliedCouponCode != null}
              id="coupon-code"
              onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
              placeholder="쿠폰 코드 입력"
              value={couponInput}
            />
            {appliedCouponCode ?
              <button
                className={`${ui.btnOutline} h-10 shrink-0 px-3 text-xs`}
                disabled={disabled || isPending}
                onClick={handleRemoveCoupon}
                type="button"
              >
                해제
              </button>
            : <button
                className={`${ui.btnOutline} h-10 shrink-0 px-3 text-xs`}
                disabled={disabled || isPending}
                onClick={handleApplyCoupon}
                type="button"
              >
                적용
              </button>
            }
          </div>
          {appliedCouponCode && displayBreakdown.couponName ?
            <p className="text-[11px] font-bold text-wadeal-ink">
              {displayBreakdown.couponName} 적용됨
            </p>
          : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-wadeal-muted" htmlFor="point-amount">
              포인트 사용
            </label>
            <span className="text-[11px] font-bold text-wadeal-muted">
              보유 {currency.format(pointBalance)}P
            </span>
          </div>
          <div className="flex gap-2">
            <input
              className={`${ui.input} h-10 flex-1 text-sm`}
              disabled={disabled || isPending}
              id="point-amount"
              inputMode="numeric"
              onChange={(event) => setPointInput(event.target.value.replace(/[^\d]/g, ""))}
              placeholder="0"
              value={pointInput}
            />
            <button
              className={`${ui.btnOutline} h-10 shrink-0 px-3 text-xs`}
              disabled={disabled || isPending || maxUsablePoints <= 0}
              onClick={handleUseAllPoints}
              type="button"
            >
              전액
            </button>
            <button
              className={`${ui.btnOutline} h-10 shrink-0 px-3 text-xs`}
              disabled={disabled || isPending}
              onClick={handleApplyPoints}
              type="button"
            >
              적용
            </button>
          </div>
          <p className="text-[10px] font-bold text-wadeal-muted">
            최대 {currency.format(maxUsablePoints)}P 사용 가능
          </p>
        </div>

        {errorMessage ?
          <p className="rounded-lg bg-[#F5F8F4] px-3 py-2 text-[11px] font-bold text-wadeal-red">
            {errorMessage}
          </p>
        : null}

        <dl className="space-y-2 border-t border-wadeal-line pt-3 text-xs font-bold text-wadeal-muted">
          <div className="flex justify-between gap-3">
            <dt>주문 금액</dt>
            <dd className="font-black text-wadeal-ink">
              {currency.format(displayBreakdown.subtotalAmount)}원
            </dd>
          </div>
          {displayBreakdown.couponDiscountAmount > 0 ?
            <div className="flex justify-between gap-3">
              <dt>쿠폰 할인</dt>
              <dd className="font-black text-wadeal-red">
                -{currency.format(displayBreakdown.couponDiscountAmount)}원
              </dd>
            </div>
          : null}
          {displayBreakdown.couponDiscountType === "free_shipping" ?
            <div className="flex justify-between gap-3">
              <dt>배송비 할인</dt>
              <dd className="font-black text-wadeal-red">무료배송</dd>
            </div>
          : null}
          {displayBreakdown.pointDiscountAmount > 0 ?
            <div className="flex justify-between gap-3">
              <dt>포인트 사용</dt>
              <dd className="font-black text-wadeal-red">
                -{currency.format(displayBreakdown.pointDiscountAmount)}P
              </dd>
            </div>
          : null}
          {displayBreakdown.shippingFee > 0 ?
            <div className="flex justify-between gap-3">
              <dt>배송비</dt>
              <dd className="font-black text-wadeal-ink">
                {currency.format(displayBreakdown.shippingFee)}원
              </dd>
            </div>
          : null}
          <div className="flex justify-between gap-3 border-t border-wadeal-line pt-2">
            <dt>최종 결제 금액</dt>
            <dd className="text-base font-black text-wadeal-ink">
              {currency.format(displayBreakdown.finalPaymentAmount)}원
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export type CheckoutDiscountSelection = {
  couponCode: string | null;
  pointAmount: number;
};

export function getDiscountSelectionFromBreakdown(
  breakdown: OrderDiscountBreakdown | null,
): CheckoutDiscountSelection {
  return {
    couponCode: breakdown?.couponCode ?? null,
    pointAmount: breakdown?.pointDiscountAmount ?? 0,
  };
}
