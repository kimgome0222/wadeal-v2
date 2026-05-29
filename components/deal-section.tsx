import Link from "next/link";
import { DealCard } from "@/components/deal-card";
import type { Deal } from "@/lib/deals";
import type { CategorySlug } from "@/lib/categories";
import { motion, ui } from "@/lib/ui";

type DealSectionProps = {
  deals: Deal[];
  title: string;
  subtitle?: string;
  moreHref?: string;
};

const sectionMoreLinks: Record<string, CategorySlug> = {
  "추천 판매자의 상품": "all",
  "오늘의 추천 상품": "all",
  "별점 높은 상품": "all",
  "리뷰 많은 상품": "all",
  "신규 판매자 상품": "all",
  "전체 상품": "all",
  "지금 주목할 상품": "closing-soon",
  "인기 상품": "closing-soon",
  "실시간 인기 상품": "all",
  "리뷰 좋은 상품": "all",
  "최근 인기 상품": "all",
  "신규 상품": "all",
};

export function DealSection({ deals, title, subtitle, moreHref }: DealSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  const href = moreHref ?? `/category/${sectionMoreLinks[title] ?? "all"}`;

  return (
    <section
      aria-label={title}
      className={`${motion.sectionEnter} space-y-3 border-t border-wadeal-line/80 bg-white pt-5`}
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className={ui.sectionTitleAccent}>{title}</h2>
          {subtitle ?
            <p className="mt-1.5 text-xs font-medium leading-relaxed text-wadeal-muted">
              {subtitle}
            </p>
          : null}
        </div>
        <Link
          className="celloh-transition shrink-0 cursor-pointer text-[13px] font-bold text-wadeal-red hover:opacity-80 active:opacity-70"
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
