import Link from "next/link";
import { DealCard } from "@/components/deal-card";
import type { Deal } from "@/lib/deals";
import type { CategorySlug } from "@/lib/categories";
import { ui } from "@/lib/ui";

type DealSectionProps = {
  deals: Deal[];
  title: string;
  moreHref?: string;
};

const sectionMoreLinks: Record<string, CategorySlug> = {
  "오늘의 공동구매": "all",
  마감임박: "closing-soon",
  인기상품: "all",
  "리뷰 좋은 딜": "all",
  신규상품: "all",
};

export function DealSection({ deals, title, moreHref }: DealSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  const href = moreHref ?? `/category/${sectionMoreLinks[title] ?? "all"}`;

  return (
    <section className="space-y-2" aria-label={title}>
      <div className="flex items-center justify-between">
        <h2 className={ui.sectionTitle}>{title}</h2>
        <Link
          className="cursor-pointer text-[13px] font-bold text-wadeal-red active:opacity-80"
          href={href}
        >
          전체보기
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {deals.map((deal) => (
          <DealCard deal={deal} key={deal.slug} />
        ))}
      </div>
    </section>
  );
}
