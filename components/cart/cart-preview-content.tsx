"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CartPreviewGrid } from "@/components/cart/cart-preview-grid";
import { CartPreviewOrderBar } from "@/components/cart/cart-preview-order-bar";
import { CartPreviewTabs } from "@/components/cart/cart-preview-tabs";
import { CommerceGoalBanner } from "@/components/coupon/commerce-goal-banner";
import { TierCouponFillRail } from "@/components/coupon/tier-coupon-fill-rail";
import type { Deal } from "@/lib/deals";
import { useCartTotalPrice } from "@/hooks/use-cart";
import {
  getCartPreviewProductsByTab,
  type CartPreviewTabId,
} from "@/lib/mock/cart-preview-products";

type CartPreviewContentProps = {
  catalog: Deal[];
  variant?: "page" | "sheet";
};

/** B마트식 마지막으로 둘러보기 */
export function CartPreviewContent({ catalog, variant = "page" }: CartPreviewContentProps) {
  const [activeTab, setActiveTab] = useState<CartPreviewTabId>("frequentlyBought");
  const cartSubtotal = useCartTotalPrice();
  const isSheet = variant === "sheet";

  const products = useMemo(
    () => getCartPreviewProductsByTab(activeTab, catalog),
    [activeTab, catalog],
  );

  return (
    <div className={`bg-white ${isSheet ? "pb-[220px]" : "min-h-screen pb-[220px]"}`}>
      {!isSheet ?
        <header className="sticky top-0 z-50 border-b border-[#E8ECEA] bg-white px-5 pb-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[20px] font-bold text-[#111111]">마지막으로 둘러보기</h1>
              <p className="mt-1 text-[13px] text-[#666666]">
                자주 사는 상품과 함께 담기 좋은 상품을 모았어요.
              </p>
              <Link
                className="mt-2 inline-flex text-[13px] font-semibold text-[#2E5E4E]"
                href="/join-cart"
              >
                장바구니 보기
              </Link>
            </div>
            <Link
              aria-label="닫기"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[22px] text-[#666666] active:bg-[#F5F7F6]"
              href="/"
            >
              ×
            </Link>
          </div>
        </header>
      : null}

      <div className={`px-4 ${isSheet ? "pt-3" : "pt-4"}`}>
        <CommerceGoalBanner showWhenEmpty subtotal={cartSubtotal} />
      </div>

      <CartPreviewTabs
        activeTab={activeTab}
        className={isSheet ? "pt-3" : "sticky top-[88px] z-40 border-b border-[#E8ECEA] bg-white py-3"}
        onTabChange={setActiveTab}
      />

      <CartPreviewGrid catalog={catalog} products={products} tabKey={activeTab} />

      {cartSubtotal > 0 ?
        <div className="px-4 pt-6">
          <TierCouponFillRail catalog={catalog} subtotal={cartSubtotal} />
        </div>
      : null}

      <CartPreviewOrderBar />
    </div>
  );
}
