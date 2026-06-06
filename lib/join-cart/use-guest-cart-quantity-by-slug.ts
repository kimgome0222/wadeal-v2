"use client";

import { useSyncExternalStore } from "react";

import {
  GUEST_CART_CHANGED_EVENT,
  getGuestJoinCartQuantityBySlug,
} from "@/lib/join-cart/guest-cart-storage";

function subscribeGuestCartQuantity(onStoreChange: () => void) {
  window.addEventListener(GUEST_CART_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(GUEST_CART_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useGuestCartQuantityBySlug(productSlug: string) {
  return useSyncExternalStore(
    subscribeGuestCartQuantity,
    () => getGuestJoinCartQuantityBySlug(productSlug),
    () => 0,
  );
}
