import Image from "next/image";

import type { Deal } from "@/lib/deals";
import { isDealSoldOut } from "@/lib/deals";
import { ds } from "@/lib/design-system";

const PRODUCT_IMAGE_PLACEHOLDER = "/wadeal-wordmark.svg";

type ProductCardImageProps = {
  deal: Deal;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** rail / grid 공통 4:5 portrait, square for category special price */
  variant?: "rail" | "grid";
  imageAspect?: "portrait" | "square";
};

/** 상품카드 이미지 — 4:5, radius 18px, 품절만 오버레이 */
export function ProductCardImage({
  deal,
  sizes,
  priority = false,
  className = "",
  variant = "grid",
  imageAspect = "portrait",
}: ProductCardImageProps) {
  const soldOut = isDealSoldOut(deal);
  const imageSrc = deal.imageUrl?.trim() || PRODUCT_IMAGE_PLACEHOLDER;
  const imageAlt = deal.title?.trim() || "상품 이미지";
  const aspectClass =
    imageAspect === "square" ? "aspect-square"
    : variant === "rail" ? "product-card__image--rail aspect-[4/5]"
    : "product-card__image--grid aspect-[4/5]";

  return (
    <div
      className={`product-card__image relative w-full overflow-hidden rounded-[18px] bg-[#F5F7F6] ${aspectClass} ${className}`.trim()}
    >
      <Image
        alt={imageAlt}
        className="h-full w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
        fill
        loading={priority ? undefined : "lazy"}
        priority={priority}
        sizes={sizes}
        src={imageSrc}
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
