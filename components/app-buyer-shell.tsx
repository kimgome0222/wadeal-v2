"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { CartAddToast } from "@/components/cart/cart-add-toast";
import { CartAddedBottomSheet } from "@/components/cart/cart-added-bottom-sheet";
import { CartPreviewBottomSheet } from "@/components/cart/cart-preview-bottom-sheet";
import { AddToCartSheetProvider } from "@/lib/cart/add-to-cart-sheet-context";
import { CartPreviewSheetProvider } from "@/lib/cart/cart-preview-sheet-context";
import { ensureGuestJoinCartStorageReady } from "@/lib/join-cart/guest-cart-storage";

/** 구매자 레이아웃 client shell — cart UX providers */
export function AppBuyerShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    ensureGuestJoinCartStorageReady();
  }, []);

  return (
    <AddToCartSheetProvider>
      <CartPreviewSheetProvider>
        {children}
        <CartAddToast />
        <CartAddedBottomSheet />
        <CartPreviewBottomSheet />
      </CartPreviewSheetProvider>
    </AddToCartSheetProvider>
  );
}
