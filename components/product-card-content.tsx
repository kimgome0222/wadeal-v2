import { DealCardPriceBlock } from "@/components/deal-card-price-block";
import type { Deal } from "@/lib/deals";
import { getDealCardRating } from "@/lib/deals/card-display";
import { resolveSellerProfileForDeal } from "@/lib/sellers/home-sellers";

type ProductCardContentProps = {
  deal: Deal;
  /** rail carousel — 상품명 2줄 유지, min-height 약간 축소 */
  rail?: boolean;
};

/**
 * 상품카드 본문 — 판매자 → 상품명 → 평점 → 가격
 * 배지·신뢰 지표·구매건수는 카드에서 숨김
 */
export function ProductCardContent({ deal, rail = false }: ProductCardContentProps) {
  const sellerName = resolveSellerProfileForDeal(deal).name;
  const rating = getDealCardRating(deal);

  return (
    <div className="product-card__body flex min-w-0 flex-col gap-1 overflow-visible pt-3">
      <p className="truncate text-[12px] font-medium leading-snug text-[#666666]">
        {sellerName}
      </p>
      <h3
        className={`line-clamp-2 text-[15px] font-semibold leading-[1.45] text-[#111111] ${
          rail ? "min-h-[2.5rem]" : "min-h-[2.75rem]"
        }`}
      >
        {deal.title}
      </h3>
      {rating ?
        <p className="text-[13px] font-normal leading-snug text-[#666666]">
          ⭐ {rating.score} ({rating.count.toLocaleString("ko-KR")})
        </p>
      : null}
      <DealCardPriceBlock deal={deal} variant="card" />
    </div>
  );
}
