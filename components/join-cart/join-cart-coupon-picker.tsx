"use client";

import { currency } from "@/lib/deals";
import {
  MOCK_OWNED_COUPONS,
  type MockCouponSelection,
  resolveOwnedCouponDiscount,
} from "@/lib/coupon/mock-owned-coupons";

type JoinCartCouponPickerProps = {
  subtotal: number;
  selection: MockCouponSelection;
  onChange: (selection: MockCouponSelection) => void;
};

export function JoinCartCouponPicker({
  subtotal,
  selection,
  onChange,
}: JoinCartCouponPickerProps) {
  if (subtotal <= 0) {
    return null;
  }

  const { recommendedId, effectiveCouponId } = resolveOwnedCouponDiscount(subtotal, selection);
  const nextUnavailable = MOCK_OWNED_COUPONS.filter((coupon) => subtotal < coupon.minSubtotal).sort(
    (a, b) => a.minSubtotal - b.minSubtotal,
  )[0];

  return (
    <section
      aria-label="보유 쿠폰"
      className="rounded-[20px] border border-[#E8ECEA] bg-white p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-bold text-[#111111]">보유 쿠폰</h3>
        {recommendedId && selection === "auto" ?
          <span className="rounded bg-[#F5F7F6] px-2 py-0.5 text-[11px] font-bold text-[#2E5E4E]">
            추천
          </span>
        : null}
      </div>

      {recommendedId ?
        <p className="mt-2 text-[12px] leading-relaxed text-[#666666]">
          현재 금액에 가장 큰 혜택 쿠폰을 추천했어요
        </p>
      : null}

      {nextUnavailable ?
        <p className="mt-1 text-[12px] text-[#999999]">
          {currency.format(nextUnavailable.minSubtotal)}원 이상 쿠폰까지{" "}
          {currency.format(nextUnavailable.minSubtotal - subtotal)}원 남았어요
        </p>
      : null}

      <div className="mt-3 space-y-2">
        <button
          aria-pressed={selection === "none"}
          className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left ${
            selection === "none" ?
              "border-[#2E5E4E] bg-[#F5F7F6]"
            : "border-[#E8ECEA] bg-white"
          }`}
          onClick={() => onChange("none")}
          type="button"
        >
          <span className="text-[13px] font-semibold text-[#111111]">쿠폰 사용 안 함</span>
        </button>

        {MOCK_OWNED_COUPONS.map((coupon) => {
          const applicable = subtotal >= coupon.minSubtotal;
          const isRecommended = coupon.id === recommendedId && selection === "auto";
          const isSelected =
            selection === coupon.id || (selection === "auto" && coupon.id === effectiveCouponId);

          return (
            <button
              aria-disabled={!applicable}
              aria-label={`${coupon.label} ${currency.format(coupon.discount)}원 할인`}
              aria-pressed={isSelected}
              className={`flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-2.5 text-left ${
                !applicable ?
                  "cursor-not-allowed border-[#E8ECEA] bg-[#FAFBFA] opacity-70"
                : isSelected ?
                  "border-[#2E5E4E] bg-[#F5F7F6]"
                : "border-[#E8ECEA] bg-white"
              }`}
              disabled={!applicable}
              key={coupon.id}
              onClick={() => onChange(coupon.id)}
              type="button"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#111111]">{coupon.label}</span>
                  {coupon.badge ?
                    <span className="rounded bg-[#FFF4E8] px-1.5 py-0.5 text-[10px] font-bold text-[#E28A3B]">
                      {coupon.badge}
                    </span>
                  : null}
                  {isRecommended ?
                    <span className="rounded bg-[#F5F7F6] px-1.5 py-0.5 text-[10px] font-bold text-[#2E5E4E]">
                      추천
                    </span>
                  : null}
                </div>
                <p className="mt-0.5 text-[11px] text-[#666666]">
                  {currency.format(coupon.minSubtotal)}원 이상 · {currency.format(coupon.discount)}
                  원 할인
                </p>
                {!applicable ?
                  <p className="mt-1 text-[11px] font-medium text-[#999999]">
                    {currency.format(coupon.minSubtotal - subtotal)}원 더 담으면 사용 가능
                  </p>
                : null}
              </div>
              <span className="shrink-0 text-[13px] font-bold tabular-nums text-[#E28A3B]">
                -{currency.format(coupon.discount)}원
              </span>
            </button>
          );
        })}
      </div>

      {effectiveCouponId && selection !== "none" ?
        <p className="mt-3 text-[12px] font-medium text-[#2E5E4E]" role="status">
          선택한 쿠폰이 결제금액에 반영됐어요
        </p>
      : null}
    </section>
  );
}
