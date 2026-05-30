"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Deal } from "@/lib/deals";
import {
  getRecentPurchasedRecommendations,
  getTogetherPurchasedRecommendations,
  type CartRecommendationItem,
} from "@/lib/mock/cart-recommendations";

type AddedCartLine = {
  deal: Deal;
  quantity: number;
};

type AddToCartSheetContextValue = {
  catalog: Deal[];
  setCatalog: (deals: Deal[]) => void;
  sheetOpen: boolean;
  addedLine: AddedCartLine | null;
  togetherPurchased: CartRecommendationItem[];
  recentPurchased: CartRecommendationItem[];
  recentPurchasedTitle: string;
  sheetInteracting: boolean;
  setSheetInteracting: (value: boolean) => void;
  openSheet: (deal: Deal, quantity?: number) => void;
  closeSheet: () => void;
};

const AddToCartSheetContext = createContext<AddToCartSheetContextValue | null>(null);

export function AddToCartSheetProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Deal[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addedLine, setAddedLine] = useState<AddedCartLine | null>(null);
  const [togetherPurchased, setTogetherPurchased] = useState<CartRecommendationItem[]>([]);
  const [recentPurchased, setRecentPurchased] = useState<CartRecommendationItem[]>([]);
  const [recentPurchasedTitle, setRecentPurchasedTitle] = useState("최근 구매했던 상품");
  const [sheetInteracting, setSheetInteracting] = useState(false);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setSheetInteracting(false);
  }, []);

  const openSheet = useCallback(
    (deal: Deal, quantity = 1) => {
      setAddedLine({ deal, quantity });
      setTogetherPurchased(getTogetherPurchasedRecommendations(catalog, deal.slug, 12));
      const recent = getRecentPurchasedRecommendations(catalog, [deal.slug], 12);
      setRecentPurchased(recent.items);
      setRecentPurchasedTitle(recent.title);
      setSheetInteracting(false);
      setSheetOpen(true);
    },
    [catalog],
  );

  const value = useMemo(
    () => ({
      catalog,
      setCatalog,
      sheetOpen,
      addedLine,
      togetherPurchased,
      recentPurchased,
      recentPurchasedTitle,
      sheetInteracting,
      setSheetInteracting,
      openSheet,
      closeSheet,
    }),
    [
      addedLine,
      catalog,
      closeSheet,
      openSheet,
      recentPurchased,
      recentPurchasedTitle,
      sheetInteracting,
      sheetOpen,
      togetherPurchased,
    ],
  );

  return (
    <AddToCartSheetContext.Provider value={value}>{children}</AddToCartSheetContext.Provider>
  );
}

export function useAddToCartSheet() {
  const context = useContext(AddToCartSheetContext);
  if (!context) {
    throw new Error("useAddToCartSheet must be used within AddToCartSheetProvider");
  }
  return context;
}
