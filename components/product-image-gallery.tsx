"use client";

import { useCallback, useState } from "react";
import { SaveDealButton } from "@/components/save-deal-button";
import type { Deal } from "@/lib/deals";
import { getDealBadgeLabel } from "@/lib/deals";
import { badgeTone } from "@/lib/ui";
import { getProductImages } from "@/lib/product-images";

type ProductImageGalleryProps = {
  deal: Deal;
  initialSaved?: boolean;
};

export function ProductImageGallery({ deal, initialSaved }: ProductImageGalleryProps) {
  const { gallery } = getProductImages(deal);
  const images = gallery.length > 0 ? gallery : deal.imageUrl ? [deal.imageUrl] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const badgeLabel = getDealBadgeLabel(deal);

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
    return (
      <div className="relative aspect-square w-full bg-wadeal-surface">
        <SaveDealButton
          className="absolute right-4 top-4 z-10"
          deal={deal}
          initialSaved={initialSaved}
        />
      </div>
    );
  }

  return (
    <div className="relative animate-celloh-fade-in bg-gray-100">
      <div
        className="relative aspect-square w-full overflow-hidden"
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
          className="h-full w-full object-cover transition-opacity duration-300"
          src={images[activeIndex]}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-md px-2.5 py-1 text-[11px] font-black shadow-sm ${badgeTone(badgeLabel)}`}
        >
          {badgeLabel}
        </span>
        <SaveDealButton
          className="absolute right-4 top-4 z-10"
          deal={deal}
          initialSaved={initialSaved}
        />
        {images.length > 1 ?
          <span className="absolute bottom-4 right-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        : null}
      </div>

      {images.length > 1 ?
        <div className="flex justify-center gap-1.5 bg-white px-4 py-3">
          {images.map((image, index) => (
            <button
              aria-label={`${index + 1}번째 이미지`}
              className={`h-1.5 rounded-full transition-all duration-[250ms] ease-smooth ${
                index === activeIndex ?
                  "w-5 bg-wadeal-red"
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
