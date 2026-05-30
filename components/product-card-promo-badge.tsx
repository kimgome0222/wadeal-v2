import type { ProductCardPromoBadge } from "@/lib/growth/cart-growth-mock";

type ProductCardPromoBadgeProps = {
  badge: ProductCardPromoBadge;
  className?: string;
};

/** 상품카드 promo badge — 쿠폰/인기 */
export function ProductCardPromoBadgeView({
  badge,
  className = "",
}: ProductCardPromoBadgeProps) {
  const isCoupon = badge.variant === "coupon";

  return (
    <span
      className={`inline-flex h-[22px] max-w-full items-center truncate rounded-lg px-2 text-[11px] font-semibold leading-none ${
        isCoupon ?
          "bg-[#FFF4E8] text-[#E28A3B]"
        : "bg-[#F5F7F6] text-[#666666]"
      } ${className}`.trim()}
    >
      {badge.label}
    </span>
  );
}
