import type { ProductCardBadgeMeta } from "@/lib/product/card-badge-meta";
import type { ProductCardPromoBadge } from "@/lib/growth/cart-growth-mock";
import { ProductCardPromoBadgeView } from "@/components/product-card-promo-badge";

type ProductCardBadgeOverlayProps = {
  badgeMeta: ProductCardBadgeMeta | null;
  promoBadge?: ProductCardPromoBadge | null;
};

/** 이미지 좌상단 badge */
export function ProductCardBadgeOverlay({
  badgeMeta,
  promoBadge = null,
}: ProductCardBadgeOverlayProps) {
  const label = badgeMeta?.badgeLabel ?? promoBadge?.label;
  if (!label) {
    return null;
  }

  const variant =
    badgeMeta?.variant === "coupon" || promoBadge?.variant === "coupon" ?
      "coupon"
    : "primary";

  if (variant === "coupon") {
    return (
      <div className="pointer-events-none absolute left-2 top-2 z-10 max-w-[80%]">
        <ProductCardPromoBadgeView
          badge={{ label, variant: "coupon" }}
        />
      </div>
    );
  }

  return (
    <span className="pointer-events-none absolute left-2 top-2 z-10 max-w-[80%] truncate rounded-lg bg-[#2E5E4E] px-[7px] py-1 text-[11px] font-bold text-white">
      {label}
    </span>
  );
}
