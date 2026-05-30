import type { ReactNode } from "react";

type HomeSellerRailTrackProps = {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
};

/** 홈 판매자 rail — 4-up snap scroll */
export function HomeSellerRailTrack({
  children,
  ariaLabel,
  className = "",
}: HomeSellerRailTrackProps) {
  return (
    <div className={`mt-4 overflow-x-auto no-scrollbar ${className}`.trim()}>
      <div
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-2 px-6"
        role="list"
      >
        {children}
      </div>
    </div>
  );
}
