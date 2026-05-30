"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type CartNavTriggerProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

/** 장바구니 아이콘 → /join-cart (실제 장바구니) */
export function CartNavTrigger({
  children,
  className = "",
  ariaLabel = "장바구니",
}: CartNavTriggerProps) {
  const router = useRouter();

  return (
    <button
      aria-label={ariaLabel}
      className={className}
      onClick={() => router.push("/join-cart")}
      type="button"
    >
      {children}
    </button>
  );
}

/** @deprecated CartNavTrigger 사용 — /join-cart 이동 */
export const CartPreviewTrigger = CartNavTrigger;
