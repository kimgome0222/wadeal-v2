"use client";

import { useSyncExternalStore } from "react";

import {
  getCartItemsSnapshot,
  getCartQuantityBySlug,
  getCartTotalCount,
  getCartTotalPrice,
  subscribeCart,
} from "@/lib/cart/cart-store";

export function useCartItems() {
  return useSyncExternalStore(subscribeCart, getCartItemsSnapshot, () => []);
}

export function useCartTotalCount() {
  return useSyncExternalStore(subscribeCart, getCartTotalCount, () => 0);
}

export function useCartTotalPrice() {
  return useSyncExternalStore(subscribeCart, getCartTotalPrice, () => 0);
}

export function useCartQuantity(slug: string) {
  return useSyncExternalStore(
    subscribeCart,
    () => getCartQuantityBySlug(slug),
    () => 0,
  );
}

/** spec 통합 cart hook */
export function useCart() {
  const items = useCartItems();
  const totalCount = useCartTotalCount();
  const subtotal = useCartTotalPrice();

  return {
    items,
    totalCount,
    subtotal,
    getQuantity: getCartQuantityBySlug,
  };
}
