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
  openPreview: () => void;
  closePreview: () => void;
};

const CartPreviewSheetContext = createContext<CartPreviewSheetContextValue | null>(null);

export function CartPreviewSheetProvider({ children }: { children: ReactNode }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const openPreview = useCallback(() => {
    setPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  const value = useMemo(
    () => ({ previewOpen, openPreview, closePreview }),
    [closePreview, openPreview, previewOpen],
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
