"use client";

import type { ReactNode } from "react";

/** 메인 commerce rail — 2.5-up peek, gap 12px */
export const HOME_COMMERCE_RAIL_ITEM_CLASS =
  "commerce-rail-item flex-none snap-start w-[calc((100vw-72px)/2.5)] min-w-[calc((100vw-72px)/2.5)] max-w-[calc((100vw-72px)/2.5)]";

export const HOME_PRODUCT_RAIL_ITEM_CLASS = HOME_COMMERCE_RAIL_ITEM_CLASS;

export const HOME_ONLY_CELLOH_ITEM_CLASS =
  "only-celloh-item flex-none snap-center w-[calc(100vw-96px)] min-w-[calc(100vw-96px)] max-w-[calc(100vw-96px)]";

export const HOME_RANKING_COLUMN_CLASS =
  "ranking-column flex-none snap-start w-[calc((100vw-60px)/1.8)] min-w-[calc((100vw-60px)/1.8)] max-w-[calc((100vw-60px)/1.8)]";

export const CART_RAIL_ITEM_CLASS = HOME_COMMERCE_RAIL_ITEM_CLASS;

type HomeCommerceRailTrackProps = {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
  snapCenter?: boolean;
};

export function HomeCommerceRailTrack({
  children,
  ariaLabel,
  className = "",
  snapCenter = false,
}: HomeCommerceRailTrackProps) {
  return (
    <div
      className={`touch-pan-x snap-x snap-mandatory overflow-x-auto overflow-y-visible no-scrollbar ${snapCenter ? "snap-center" : ""} ${className}`.trim()}
    >
      <div
        aria-label={ariaLabel}
        className={`flex snap-x snap-mandatory gap-3 px-6 ${snapCenter ? "snap-center" : ""}`}
        role="list"
      >
        {children}
      </div>
    </div>
  );
}

export function HomeCommerceRailItem({ children }: { children: ReactNode }) {
  return (
    <div className={HOME_COMMERCE_RAIL_ITEM_CLASS} data-rail-item role="listitem">
      {children}
    </div>
  );
}

/** @deprecated HomeCommerceRailTrack 사용 */
export function HomeProductRailTrack({
  children,
  ariaLabel,
  className = "",
}: {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <HomeCommerceRailTrack ariaLabel={ariaLabel} className={className}>
      {children}
    </HomeCommerceRailTrack>
  );
}

/** @deprecated HomeCommerceRailItem 사용 */
export function HomeProductRailItem({ children }: { children: ReactNode }) {
  return <HomeCommerceRailItem>{children}</HomeCommerceRailItem>;
}
