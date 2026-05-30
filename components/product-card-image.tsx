import Image from "next/image";

import type { Deal } from "@/lib/deals";
import { isDealSoldOut } from "@/lib/deals";
import { ds } from "@/lib/design-system";

type ProductCardImageProps = {
  deal: Deal;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** rail: 1:1 square · grid: 4:5 portrait (default) */
  variant?: "rail" | "grid";
};

/** 상품카드 이미지 — rail 1:1 / grid 4:5, radius 18px, 품절만 오버레이 */
export function ProductCardImage({
  deal,
  sizes,
  priority = false,
  className = "",
  variant = "grid",
}: ProductCardImageProps) {
  const soldOut = isDealSoldOut(deal);
  const variantClass =
    variant === "rail" ? "product-card__image--rail aspect-square" : "product-card__image--grid aspect-[4/5]";

  return (
    <div
      className={`product-card__image relative w-full overflow-hidden rounded-[18px] bg-[#F5F7F6] ${variantClass} ${className}`.trim()}
    >
      <Image
        alt={deal.title}
        className="h-full w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
        fill
        loading={priority ? undefined : "lazy"}
        priority={priority}
        sizes={sizes}
        src={deal.imageUrl}
      />
      {soldOut ?
        <span
          className={`absolute bottom-2 left-2 ${ds.badge.base} bg-gray-800/85 text-white`}
        >
          품절
        </span>
      : null}
    </div>
  );
}
