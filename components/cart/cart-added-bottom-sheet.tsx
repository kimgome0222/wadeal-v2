"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { CartRecommendationRail } from "@/components/cart/cart-recommendation-rail";
import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";
import { currency } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";

/** B마트식 장바구니 담기 Bottom Sheet — z-100 */
export function CartAddedBottomSheet() {
  const {
    sheetOpen,
    addedLine,
    togetherPurchased,
    recentPurchased,
    recentPurchasedTitle,
    sheetInteracting,
    setSheetInteracting,
    closeSheet,
  } = useAddToCartSheet();

  useEffect(() => {
    if (!sheetOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSheet();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeSheet, sheetOpen]);

  if (!sheetOpen || !addedLine) {
    return null;
  }

  const { deal, quantity } = addedLine;
  const { applicablePrice } = getTierProgress(deal);

  return (
    <>
      <button
        aria-label="닫기"
        className="fixed inset-0 z-[100] bg-black/16"
        onClick={closeSheet}
        type="button"
      />
      <div
        aria-label="장바구니 담기 완료"
        className="cart-added-bottom-sheet fixed inset-x-0 bottom-0 z-[101] mx-auto max-w-[430px] overflow-y-auto rounded-t-[20px] bg-white px-6 pb-[max(env(safe-area-inset-bottom),20px)] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
        onScroll={() => setSheetInteracting(true)}
        onTouchStart={() => setSheetInteracting(true)}
        role="dialog"
      >
        <div aria-hidden className="mx-auto mb-4 h-1 w-9 rounded-full bg-[#DADADA]" />

        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[18px] font-bold text-[#111111]">장바구니에 상품 담았어요</p>
          </div>
          <button
            aria-label="닫기"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[20px] text-[#666666] active:bg-[#F5F7F6]"
            onClick={closeSheet}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#E8ECEA] bg-[#FAFBFA] p-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F5F7F6]">
            {deal.imageUrl ?
              <Image alt="" className="object-cover" fill sizes="56px" src={deal.imageUrl} />
            : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-[14px] font-semibold text-[#111111]">{deal.title}</p>
            <p className="mt-1 text-[15px] font-bold tabular-nums text-[#111111]">
              {currency.format(applicablePrice)}원
            </p>
          </div>
          <span className="shrink-0 text-[14px] font-semibold text-[#666666]">{quantity}개</span>
        </div>

        <Link
          className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-[#2E5E4E] text-[15px] font-semibold text-white active:opacity-90"
          href="/join-cart"
          onClick={closeSheet}
        >
          장바구니 바로가기
        </Link>

        <button
          className="mt-2 flex h-11 w-full items-center justify-center text-[14px] font-medium text-[#666666] active:text-[#111111]"
          onClick={closeSheet}
          type="button"
        >
          계속 쇼핑하기
        </button>

        <CartRecommendationRail
          ariaLabel="다른 사람들이 함께 구매한 상품"
          items={togetherPurchased}
          title="다른 사람들이 함께 구매한 상품"
        />

        <CartRecommendationRail
          ariaLabel={recentPurchasedTitle}
          items={recentPurchased}
          title={recentPurchasedTitle}
        />
      </div>
    </>
  );
}
