"use client";

import type { ReactNode } from "react";

export { HOME_PRODUCT_RAIL_ITEM_CLASS } from "@/components/home/home-commerce-rail-track";

type HomeProductRailTrackProps = {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
};

/** 홈 상품 rail — 2.5-up snap scroll, gap 16px */
export function HomeProductRailTrack({
  children,
  ariaLabel,
  className = "",
}: HomeProductRailTrackProps) {
  return (
    <div className={`mt-4 touch-pan-x snap-x snap-mandatory overflow-x-auto overflow-y-visible no-scrollbar ${className}`.trim()}>
      <div
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-4 px-6"
        role="list"
      >
        {children}
      </div>
    </div>
  );
}

type HomeProductRailItemProps = {
  children: ReactNode;
};

export function HomeProductRailItem({ children }: HomeProductRailItemProps) {
  return (
    <div
      className="card-rail-item flex-none snap-start w-[calc((100vw-72px)/2.5)] min-w-[calc((100vw-72px)/2.5)] max-w-[calc((100vw-72px)/2.5)]"
      data-rail-item
      role="listitem"
    >
      {children}
    </div>
  );
}
