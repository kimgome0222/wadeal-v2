"use client";

import {
  addToJoinCartAction,
  setJoinCartQuantityBySlugAction,
} from "@/app/actions/join-cart";
import {
  decrementCartQuantity,
  getCartQuantityBySlug,
  incrementCartQuantity,
  setCartQuantity,
} from "@/lib/cart/cart-store";
import type { Deal } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import type { GuestJoinCartSnapshot } from "@/lib/join-cart/guest-cart-storage";
import { recordRecentPurchase } from "@/lib/mock/cart-recommendations";

export type AddDealToCartResult =
  | { success: true; loginRequired: boolean }
  | { success: false; error: "deal_closed" | "unknown" };

export function buildGuestCartSnapshot(deal: Deal): GuestJoinCartSnapshot {
  const { applicablePrice } = getTierProgress(deal);
  return {
    productSlug: deal.slug,
    productName: deal.title,
    estimatedUnitPrice: applicablePrice,
    sellerName: deal.brandName?.trim() || "celloh 셀러",
    imageUrl: deal.imageUrl?.trim() || "",
  };
}

function warnServerCartSync(context: string, result: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[cart] ${context} server sync skipped`, result);
  }
}

/** 공통 담기 — client store 즉시 반영, server는 best-effort */
export async function addDealToCart(
  deal: Deal,
  quantity = 1,
): Promise<AddDealToCartResult> {
  const previousQuantity = getCartQuantityBySlug(deal.slug);
  setCartQuantity(deal, Math.min(99, previousQuantity + quantity));
  recordRecentPurchase(deal.slug);

  void addToJoinCartAction(deal.slug, quantity).then((result) => {
    if ("error" in result && result.error === "login_required") {
      return;
    }

    if ("error" in result && result.error === "deal_closed") {
      setCartQuantity(deal, previousQuantity);
      return;
    }

    if (!result.success) {
      warnServerCartSync("add", result);
    }
  });

  return { success: true, loginRequired: false };
}

/** +1 담기 — stepper / rail + */
export async function incrementDealCartQuantity(
  deal: Deal,
  currentQuantity: number,
): Promise<AddDealToCartResult> {
  incrementCartQuantity(deal, currentQuantity);
  recordRecentPurchase(deal.slug);

  void addToJoinCartAction(deal.slug, 1).then((result) => {
    if ("error" in result && result.error === "login_required") {
      return;
    }

    if ("error" in result && result.error === "deal_closed") {
      decrementCartQuantity(deal, currentQuantity + 1);
      return;
    }

    if (!result.success) {
      warnServerCartSync("increment", result);
    }
  });

  return { success: true, loginRequired: false };
}

/** -1 담기 — stepper - */
export async function decrementDealCartQuantity(
  deal: Deal,
  currentQuantity: number,
): Promise<AddDealToCartResult> {
  const nextQuantity = Math.max(0, currentQuantity - 1);
  decrementCartQuantity(deal, currentQuantity);

  void setJoinCartQuantityBySlugAction(deal.slug, nextQuantity).then((result) => {
    if ("error" in result && result.error === "login_required") {
      return;
    }

    if (!result.success) {
      warnServerCartSync("decrement", result);
    }
  });

  return { success: true, loginRequired: false };
}
