"use client";

import Link from "next/link";

import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { ProductCardContent } from "@/components/product-card-content";
import { ProductCardImage } from "@/components/product-card-image";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";

type MypageRecentViewsRailProps = {
  deals: Deal[];
};

export function MypageRecentViewsRail({ deals }: MypageRecentViewsRailProps) {
  if (deals.length === 0) {
    return (
      <section className="space-y-4 px-6 pt-10">
        <h2 className="text-[20px] font-bold text-[#111111]">최근 본 상품</h2>
        <p className="rounded-[20px] bg-[#F5F7F6] py-8 text-center text-[14px] text-[#666666]">
          최근 본 상품이 없어요.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 pt-10">
      <div className="flex items-end justify-between gap-3 px-6">
        <h2 className="text-[20px] font-bold text-[#111111]">최근 본 상품</h2>
        <Link className="text-[13px] font-medium text-[#666666]" href="/mypage/recent">
          더보기
        </Link>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-6 pb-0.5">
        {deals.map((deal) => {
          const productHref = getProductDetailHref(deal);

          return (
            <article
              className={`${ds.productCard.rail} card-rail-item relative shrink-0`}
              key={deal.slug}
            >
              <Link
                aria-label={`${deal.title} 상세보기`}
                className="group block min-w-0 cursor-pointer"
                href={productHref}
              >
                <ProductCardImage deal={deal} sizes="160px" variant="rail" />
                <ProductCardContent deal={deal} variant="rail" />
              </Link>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-20 aspect-[4/5]"
              >
                <CartQuantityControl
                  className="pointer-events-auto"
                  deal={deal}
                  openSheetOnFirstAdd={false}
                  size="rail"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
