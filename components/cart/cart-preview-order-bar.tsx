"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { TierCouponBanner } from "@/components/coupon/tier-coupon-banner";
import { useCartPreviewSheet } from "@/lib/cart/cart-preview-sheet-context";
import { currency } from "@/lib/deals";
import { getTierCouponDiscount } from "@/lib/coupon/tier-coupon";
import { useCartTotalCount, useCartTotalPrice } from "@/hooks/use-cart";

type CartPreviewOrderBarProps = {
  /** sheet/page 공통 — last-look checkout href는 context에서 읽음 */
  mode?: "page" | "lastLook";
};

/** cart preview / last-look 하단 고정 주문바 */
export function CartPreviewOrderBar({ mode = "page" }: CartPreviewOrderBarProps) {
  const router = useRouter();
  const { lastLookContinueHref, continueToCheckout } = useCartPreviewSheet();
  const totalCount = useCartTotalCount();
  const totalPrice = useCartTotalPrice();
  const tierCouponDiscount = getTierCouponDiscount(totalPrice);
  const payableTotal = Math.max(0, totalPrice - tierCouponDiscount);
  const isLastLook = mode === "lastLook" || lastLookContinueHref != null;
  const disabled = !isLastLook && totalCount <= 0;

  function handlePrimaryClick() {
    if (isLastLook) {
      const href = continueToCheckout();
      if (href) {
        router.push(href);
      }
      return;
    }

    if (!disabled) {
      router.push("/join-cart");
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[110] mx-auto max-w-[430px] border-t border-[#E8ECEA] bg-white px-5 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
      {totalPrice > 0 ?
        <div className="mb-3">
          <TierCouponBanner subtotal={totalPrice} />
        </div>
      : null}
      {!isLastLook ?
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[14px] font-medium text-[#666666]">총 장바구니 금액</p>
          <p className="text-[16px] font-bold tabular-nums text-[#111111]">
            {currency.format(payableTotal)}원
          </p>
        </div>
      : null}
      <button
        className={`flex h-14 w-full items-center justify-center rounded-2xl text-[16px] font-bold transition-colors duration-[100ms] ${
          disabled ?
            "cursor-not-allowed bg-[#E8ECEA] text-[#999999]"
          : "bg-[#2E5E4E] text-white active:opacity-90"
        }`}
        disabled={disabled}
        onClick={handlePrimaryClick}
        type="button"
      >
        {isLastLook ?
          "결제하기"
        : disabled ?
          "상품을 담아주세요"
        : `${currency.format(payableTotal)}원 주문하기`}
      </button>
      {!isLastLook ?
        <Link
          className="mt-2 flex h-10 w-full items-center justify-center text-[13px] font-medium text-[#666666] active:text-[#2E5E4E]"
          href="/join-cart"
        >
          장바구니 보기
        </Link>
      : null}
    </div>
  );
}
