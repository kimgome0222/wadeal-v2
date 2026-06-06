"use client";

import { useEffect, useState } from "react";

import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";

/** 담기 직후 1.5s toast — bottom sheet와 병행 */
export function CartAddToast() {
  const { sheetOpen, addedLine } = useAddToCartSheet();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sheetOpen || !addedLine) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 1500);
    return () => window.clearTimeout(timer);
  }, [addedLine, sheetOpen]);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+72px)] z-[95] mx-auto flex max-w-[430px] justify-center px-6"
      role="status"
    >
      <p className="rounded-full bg-[#111111]/88 px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)]">
        상품 담았어요
      </p>
    </div>
  );
}
