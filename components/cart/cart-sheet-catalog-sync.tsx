"use client";

import { useEffect } from "react";

import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";
import type { Deal } from "@/lib/deals";

/** 페이지 catalog → bottom sheet 추천 mock에 전달 */
export function CartSheetCatalogSync({ catalog }: { catalog: Deal[] }) {
  const { setCatalog } = useAddToCartSheet();

  useEffect(() => {
    if (catalog.length > 0) {
      setCatalog(catalog);
    }
  }, [catalog, setCatalog]);

  return null;
}
