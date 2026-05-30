"use client";

import { useEffect, useState } from "react";

import {
  GUEST_CART_CHANGED_EVENT,
  getGuestJoinCartCount,
} from "@/lib/join-cart/guest-cart-storage";

export function useGuestJoinCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function sync() {
      setCount(getGuestJoinCartCount());
    }

    sync();
    window.addEventListener(GUEST_CART_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(GUEST_CART_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return count;
}
