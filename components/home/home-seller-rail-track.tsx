import type { ReactNode } from "react";

type HomeSellerRailTrackProps = {
  children: ReactNode;
  ariaLabel: string;
};

/** 홈 판매자 rail — 4-up snap scroll */
export function HomeSellerRailTrack({ children, ariaLabel }: HomeSellerRailTrackProps) {
  return (
    <div className="relative -mx-6 px-6">
      <div
        aria-label={ariaLabel}
        className="celloh-seller-carousel-track no-scrollbar"
        role="list"
      >
        {children}
      </div>
    </div>
  );
}
