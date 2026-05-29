import Link from "next/link";

import { DealCard } from "@/components/deal-card";
import type { Deal } from "@/lib/deals";
import { getDealDiscount } from "@/lib/deals";
import { ui } from "@/lib/ui";

type HomeReviewedDealsSectionProps = {
  deals: Deal[];
};

export function HomeReviewedDealsSection({ deals }: HomeReviewedDealsSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  const ranked = [...deals]
    .sort((a, b) => {
      const scoreA = a.participants * 10 + getDealDiscount(a);
      const scoreB = b.participants * 10 + getDealDiscount(b);
      return scoreB - scoreA;
    })
    .slice(0, 4);

  return (
    <section aria-label="리뷰 좋은 상품" className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className={ui.sectionTitle}>리뷰 좋은 상품</h2>
        <Link
          className="cursor-pointer text-[13px] font-bold text-wadeal-red active:opacity-80"
          href="/category/all"
        >
          더보기
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ranked.map((deal) => (
          <DealCard deal={deal} key={deal.slug} />
        ))}
      </div>
    </section>
  );
}
