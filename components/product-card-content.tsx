import { DealCardPriceBlock } from "@/components/deal-card-price-block";
import { ProductCardPromoBadgeView } from "@/components/product-card-promo-badge";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import type { ProductCardPromoBadge } from "@/lib/growth/cart-growth-mock";
import { getMockCouponAppliedPrice } from "@/lib/growth/cart-growth-mock";
import { getProductCardReviewMeta } from "@/lib/product/card-badge-meta";

type ProductCardContentProps = {
  deal: Deal;
  variant?: "rail" | "grid";
  promoBadge?: ProductCardPromoBadge | null;
  showCouponPrice?: boolean;
  urgencyLabel?: string;
};

/** 상품카드 본문 — 상품명 → 리뷰 → 가격 (담기는 이미지 우하단) */
export function ProductCardContent({
  deal,
  variant = "grid",
  promoBadge = null,
  showCouponPrice = false,
  urgencyLabel,
}: ProductCardContentProps) {
  const review = getProductCardReviewMeta(deal);
  const couponPrice =
    showCouponPrice && promoBadge?.variant === "coupon" ?
      getMockCouponAppliedPrice(deal)
    : null;

  return (
    <div className={`product-card__body flex min-w-0 flex-col overflow-visible ${variant === "rail" ? "pt-2" : "pt-2.5"}`}>
      <h3 className={`line-clamp-2 font-semibold leading-[1.35] text-[#111111] ${variant === "rail" ? "text-[14px]" : "text-[15px]"}`}>
        {deal.title}
      </h3>
      {review ?
        <p className={`font-normal leading-snug text-[#666666] ${variant === "rail" ? "mt-1 text-[12px]" : "mt-1.5 text-[13px]"}`}>
          ★ {review.score} 리뷰 {review.countLabel}
        </p>
      : null}
      {promoBadge && promoBadge.variant === "coupon" && !showCouponPrice ?
        <div className="mt-1.5">
          <ProductCardPromoBadgeView badge={promoBadge} />
        </div>
      : null}
      {urgencyLabel ?
        <p className="mt-1 text-[11px] font-medium text-[#E28A3B]">{urgencyLabel}</p>
      : null}
      <div className={`min-w-0 ${variant === "rail" ? "mt-1.5" : review || promoBadge || urgencyLabel ? "mt-2" : "mt-1.5"}`}>
        <DealCardPriceBlock
          deal={deal}
          priceVariant={variant === "rail" ? "rail" : "card"}
          variant="card"
        />
        {couponPrice != null ?
          <p className="mt-1 text-[11px] font-semibold text-[#E28A3B]">
            쿠폰 적용가 {currency.format(couponPrice)}원
          </p>
        : null}
      </div>
    </div>
  );
}
