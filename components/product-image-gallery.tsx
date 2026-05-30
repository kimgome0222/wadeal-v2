"use client";

import { useCallback, useState } from "react";
import type { Deal } from "@/lib/deals";
import { getDealBadgeLabel, isDealSoldOut } from "@/lib/deals";
import { badgeTone } from "@/lib/ui";
import { getProductImages } from "@/lib/product-images";

type ProductImageGalleryProps = {
  deal: Deal;
};

function shouldShowGalleryBadge(label: string): boolean {
  if (label === "셀러 상품" || label === "판매 중") {
    return false;
  }
  if (label.includes("혜택") || label.includes("공구") || label.includes("공동")) {
    return false;
  }
  return label === "품절" || label === "인기" || label === "신규";
}

export function ProductImageGallery({ deal }: ProductImageGalleryProps) {
  const { gallery } = getProductImages(deal);
  const images = gallery.length > 0 ? gallery : deal.imageUrl ? [deal.imageUrl] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const badgeLabel = getDealBadgeLabel(deal);
  const showBadge = shouldShowGalleryBadge(badgeLabel) || isDealSoldOut(deal);
  const displayBadge = isDealSoldOut(deal) ? "품절" : badgeLabel;

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) {
        return;
      }
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  if (images.length === 0) {
    return <div className="mx-4 aspect-square w-auto rounded-[20px] bg-[#F5F8F4]" />;
  }

  return (
    <div className="bg-white px-4 pt-2">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#F5F8F4]"
        onTouchEnd={(event) => {
          const touch = event.changedTouches[0];
          const startX = Number((event.currentTarget as HTMLElement).dataset.startX ?? touch.clientX);
          const delta = touch.clientX - startX;
          if (Math.abs(delta) > 40) {
            goTo(activeIndex + (delta < 0 ? 1 : -1));
          }
        }}
        onTouchStart={(event) => {
          (event.currentTarget as HTMLElement).dataset.startX = String(
            event.changedTouches[0].clientX,
          );
        }}
      >
        <img
          alt={deal.title}
          className="h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
          loading="eager"
          src={images[activeIndex]}
        />
        {showBadge ?
          <span
            className={`absolute left-4 top-4 rounded-md px-2 py-0.5 text-[10px] font-medium ${badgeTone(displayBadge)}`}
          >
            {displayBadge}
          </span>
        : null}
        {images.length > 1 ?
          <span className="absolute bottom-4 right-4 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        : null}
      </div>

      {images.length > 1 ?
        <div className="flex justify-center gap-1.5 bg-white px-4 py-2.5">
          {images.map((image, index) => (
            <button
              aria-label={`${index + 1}번째 이미지`}
              className={`h-1.5 rounded-full transition-all duration-200 ease-smooth ${
                index === activeIndex ?
                  "w-5 bg-[#2E5E4E]"
                : "w-1.5 bg-gray-300"
              }`}
              key={image}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      : null}
    </div>
  );
}
