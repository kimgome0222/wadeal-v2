"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type CartPreviewTriggerProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

/** 장바구니 아이콘 → /cart-preview (마지막으로 둘러보기) */
export function CartPreviewTrigger({
  children,
  className = "",
  ariaLabel = "장바구니",
}: CartPreviewTriggerProps) {
  const router = useRouter();

  return (
    <button
      aria-label={ariaLabel}
      className={className}
      onClick={() => router.push("/cart-preview")}
      type="button"
    >
      {children}
    </button>
  );
}
