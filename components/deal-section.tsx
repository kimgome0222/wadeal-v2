import Link from "next/link";
import { DealCard } from "@/components/deal-card";
import type { Deal } from "@/lib/deals";
import type { CategorySlug } from "@/lib/categories";

type DealSectionProps = {
  deals: Deal[];
  title: string;
  moreHref?: string;
};

const sectionMoreLinks: Record<string, CategorySlug> = {
  "오늘 마감": "closing-soon",
  "친구 초대 급상승": "all",
  "식품 인기 공동구매": "food",
  "생활용품 공동구매": "living",
};

export function DealSection({ deals, title, moreHref }: DealSectionProps) {
  const href = moreHref ?? `/category/${sectionMoreLinks[title] ?? "all"}`;

  return (
    <section className="space-y-3" aria-label={title}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black tracking-normal text-wadeal-ink">
          {title}
        </h2>
        <Link className="text-sm font-bold text-wadeal-red" href={href}>
          전체보기
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {deals.map((deal) => (
          <DealCard deal={deal} key={deal.slug} />
        ))}
      </div>
    </section>
  );
}
