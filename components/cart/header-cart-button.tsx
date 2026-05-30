"use client";

import type { ReactNode } from "react";

import { CartPreviewTrigger } from "@/components/cart/cart-preview-trigger";

type HeaderCartButtonProps = {
  badge?: number;
  children: ReactNode;
  className?: string;
};

/** header/PDP 장바구니 — preview bottom sheet open */
export function HeaderCartButton({ badge = 0, children, className = "" }: HeaderCartButtonProps) {
  return (
    <CartPreviewTrigger
      ariaLabel="장바구니"
      className={`relative flex cursor-pointer items-center justify-center transition-all duration-200 ease-out hover:bg-gray-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/25 ${className}`.trim()}
    >
      {children}
      {badge > 0 ?
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-wadeal-red px-1 text-[9px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      : null}
    </CartPreviewTrigger>
  );
}
