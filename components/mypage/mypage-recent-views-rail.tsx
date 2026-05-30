import Link from "next/link";

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
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-6 pb-0.5">
        {deals.map((deal) => (
          <Link
            className={`${ds.productCard.grid} w-[140px] shrink-0 min-w-0`}
            href={getProductDetailHref(deal)}
            key={deal.slug}
          >
            <ProductCardImage deal={deal} sizes="140px" />
            <ProductCardContent deal={deal} />
          </Link>
        ))}
      </div>
    </section>
  );
}
