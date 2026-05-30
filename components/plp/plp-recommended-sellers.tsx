import { HomeSellerRailTrack } from "@/components/home/home-seller-rail-track";
import { PlpSellerCompactCard } from "@/components/plp/plp-seller-compact-card";
import type { SellerProfile } from "@/lib/sellers/types";

type PlpRecommendedSellersProps = {
  sellers: SellerProfile[];
  title?: string;
  className?: string;
  maxItems?: number;
};

/** PLP·카테고리 추천 판매자 — 4-up compact rail, 상품 grid 아래 */
export function PlpRecommendedSellers({
  sellers,
  title = "추천 판매자",
  className = "",
  maxItems = 8,
}: PlpRecommendedSellersProps) {
  if (sellers.length === 0) {
    return null;
  }

  const displayed = sellers.slice(0, maxItems);

  return (
    <section aria-label={title} className={`space-y-4 ${className}`}>
      <h2 className="text-[20px] font-bold text-[#111111]">{title}</h2>
      <HomeSellerRailTrack ariaLabel={title} className="mt-0">
        {displayed.map((seller) => (
          <PlpSellerCompactCard key={seller.id} seller={seller} />
        ))}
      </HomeSellerRailTrack>
    </section>
  );
}
