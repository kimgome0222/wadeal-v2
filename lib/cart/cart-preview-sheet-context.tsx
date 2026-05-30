"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartPreviewSheetContextValue = {
  previewOpen: boolean;
  /** 상품상세 구매하기 → last-look 후 이동할 checkout/join-cart href */
  lastLookContinueHref: string | null;
  openLastLook: (continueHref?: string) => void;
  closePreview: () => void;
  continueToCheckout: () => string | null;
};

const CartPreviewSheetContext = createContext<CartPreviewSheetContextValue | null>(null);

export function CartPreviewSheetProvider({ children }: { children: ReactNode }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [lastLookContinueHref, setLastLookContinueHref] = useState<string | null>(null);

  const openLastLook = useCallback((continueHref?: string) => {
    setLastLookContinueHref(continueHref?.trim() || null);
    setPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    setLastLookContinueHref(null);
  }, []);

  const continueToCheckout = useCallback(() => {
    const href = lastLookContinueHref ?? "/join-cart";
    setPreviewOpen(false);
    setLastLookContinueHref(null);
    return href;
  }, [lastLookContinueHref]);

  const value = useMemo(
    () => ({
      previewOpen,
      lastLookContinueHref,
      openLastLook,
      closePreview,
      continueToCheckout,
    }),
    [closePreview, continueToCheckout, lastLookContinueHref, openLastLook, previewOpen],
  );

  return (
    <CartPreviewSheetContext.Provider value={value}>{children}</CartPreviewSheetContext.Provider>
  );
}

export function useCartPreviewSheet() {
  const context = useContext(CartPreviewSheetContext);
  if (!context) {
    throw new Error("useCartPreviewSheet must be used within CartPreviewSheetProvider");
  }
  return context;
}
