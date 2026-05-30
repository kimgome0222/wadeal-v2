"use client";

import {
  addToJoinCartAction,
  setJoinCartQuantityBySlugAction,
} from "@/app/actions/join-cart";
import type { Deal } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import {
  addGuestJoinCartItem,
  setGuestJoinCartQuantityBySlug,
  type GuestJoinCartSnapshot,
} from "@/lib/join-cart/guest-cart-storage";
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

/** 공통 담기 — guest localStorage 또는 server action (+quantity) */
export async function addDealToCart(
  deal: Deal,
  quantity = 1,
): Promise<AddDealToCartResult> {
  const result = await addToJoinCartAction(deal.slug, quantity);

  if ("error" in result && result.error === "login_required") {
    addGuestJoinCartItem(buildGuestCartSnapshot(deal), quantity);
    recordRecentPurchase(deal.slug);
    return { success: true, loginRequired: true };
  }

  if ("error" in result && result.error === "deal_closed") {
    return { success: false, error: "deal_closed" };
  }

  if (result.success) {
    recordRecentPurchase(deal.slug);
    return { success: true, loginRequired: false };
  }

  return { success: false, error: "unknown" };
}

async function applyGuestQuantity(deal: Deal, quantity: number) {
  setGuestJoinCartQuantityBySlug(buildGuestCartSnapshot(deal), quantity);
  if (quantity > 0) {
    recordRecentPurchase(deal.slug);
  }
}

/** +1 담기 — stepper / rail + */
export async function incrementDealCartQuantity(
  deal: Deal,
  currentQuantity: number,
): Promise<AddDealToCartResult> {
  const result = await addToJoinCartAction(deal.slug, 1);

  if ("error" in result && result.error === "login_required") {
    await applyGuestQuantity(deal, currentQuantity + 1);
    return { success: true, loginRequired: true };
  }

  if (!result.success) {
    return { success: false, error: "unknown" };
  }

  recordRecentPurchase(deal.slug);
  return { success: true, loginRequired: false };
}

/** -1 담기 — stepper - */
export async function decrementDealCartQuantity(
  deal: Deal,
  currentQuantity: number,
): Promise<AddDealToCartResult> {
  const nextQuantity = Math.max(0, currentQuantity - 1);
  const result = await setJoinCartQuantityBySlugAction(deal.slug, nextQuantity);

  if ("error" in result && result.error === "login_required") {
    await applyGuestQuantity(deal, nextQuantity);
    return { success: true, loginRequired: true };
  }

  if (!result.success) {
    return { success: false, error: "unknown" };
  }

  return { success: true, loginRequired: false };
}
