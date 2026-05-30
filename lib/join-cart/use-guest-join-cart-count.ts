"use client";

import { useSyncExternalStore } from "react";

import {
  GUEST_CART_CHANGED_EVENT,
  getGuestJoinCartCount,
} from "@/lib/join-cart/guest-cart-storage";

function subscribeGuestCartCount(onStoreChange: () => void) {
  window.addEventListener(GUEST_CART_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(GUEST_CART_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useGuestJoinCartCount() {
  return useSyncExternalStore(
    subscribeGuestCartCount,
    getGuestJoinCartCount,
    () => 0,
  );
}
