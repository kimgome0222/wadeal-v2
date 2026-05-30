import { DealCardPriceBlock } from "@/components/deal-card-price-block";
import type { Deal } from "@/lib/deals";
import { getDealCardRating } from "@/lib/deals/card-display";

type ProductCardContentProps = {
  deal: Deal;
  /** rail: 홈·마이페이지 가로 rail 간격 */
  variant?: "rail" | "grid";
};

/** 상품카드 본문 — 상품명 → 평점 → 가격 (판매자명 미노출) */
export function ProductCardContent({ deal, variant = "grid" }: ProductCardContentProps) {
  const rating = getDealCardRating(deal);
  const isRail = variant === "rail";

  return (
    <div
      className={`product-card__body flex min-w-0 flex-col overflow-visible ${isRail ? "pt-2.5" : "pt-3"}`}
    >
      <h3 className="line-clamp-2 text-[15px] font-semibold leading-[1.45] text-[#111111]">
        {deal.title}
      </h3>
      {rating ?
        <p
          className={`text-[13px] font-normal leading-snug text-[#666666] ${isRail ? "mt-1.5" : "mt-2"}`}
        >
          ⭐ {rating.score} ({rating.count.toLocaleString("ko-KR")})
        </p>
      : null}
      <div className={`min-w-0 ${isRail ? "mt-2" : "mt-2.5"}`}>
        <DealCardPriceBlock deal={deal} priceVariant={isRail ? "rail" : "card"} variant="card" />
      </div>
    </div>
  );
}
