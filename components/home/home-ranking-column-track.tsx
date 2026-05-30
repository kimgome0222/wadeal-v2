"use client";

import type { ReactNode } from "react";

import { HOME_RANKING_COLUMN_CLASS } from "@/components/home/home-commerce-rail-track";

export function HomeRankingColumnTrack({
  children,
  ariaLabel,
  className = "",
}: {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div className={`mt-2 snap-x snap-mandatory overflow-x-auto no-scrollbar ${className}`.trim()}>
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

export function HomeRankingColumnShell({ children }: { children: ReactNode }) {
  return (
    <div className={`${HOME_RANKING_COLUMN_CLASS} flex flex-col gap-3`} role="listitem">
      {children}
    </div>
  );
}
