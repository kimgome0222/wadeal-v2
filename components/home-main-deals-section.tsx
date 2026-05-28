import Link from "next/link";

import { DealCardFeatured } from "@/components/deal-card-featured";
import type { Deal } from "@/lib/deals";
import { ui } from "@/lib/ui";

type HomeMainDealsSectionProps = {
  deals: Deal[];
  title?: string;
};

export function HomeMainDealsSection({
  deals,
  title = "오늘의 공동구매",
}: HomeMainDealsSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <section aria-label={title} className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className={ui.sectionTitle}>{title}</h2>
        <Link
          className="cursor-pointer text-[13px] font-bold text-wadeal-red active:opacity-80"
          href="/category/all"
        >
          전체보기
        </Link>
      </div>
      <div className="space-y-2">
        {deals.map((deal) => (
          <DealCardFeatured deal={deal} key={deal.slug} />
        ))}
      </div>
    </section>
  );
}
