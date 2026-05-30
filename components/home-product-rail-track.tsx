"use client";

import type { ReactNode } from "react";

type HomeProductRailTrackProps = {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
};

/** 홈 상품 rail — 2-up snap scroll (overflow on wrapper, gap on flex track) */
export function HomeProductRailTrack({
  children,
  ariaLabel,
  className = "",
}: HomeProductRailTrackProps) {
  return (
    <div className={`mt-4 overflow-x-auto no-scrollbar ${className}`.trim()}>
      <div
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-3 px-6"
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
    <div className="card-rail-item flex-none" data-rail-item role="listitem">
      {children}
    </div>
  );
}
