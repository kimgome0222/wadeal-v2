"use client";

import {
  decrementCartQuantity,
  getCartQuantityBySlug,
  incrementCartQuantity,
  setCartQuantity,
} from "@/lib/cart/cart-store";
import { trySyncCartAdd, trySyncCartQuantityBySlug } from "@/lib/cart/local-cart-sync";
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

/** 공통 담기 — client store 즉시 반영, server는 best-effort (rollback 없음) */
export async function addDealToCart(
  deal: Deal,
  quantity = 1,
): Promise<AddDealToCartResult> {
  const previousQuantity = getCartQuantityBySlug(deal.slug);
  setCartQuantity(deal, Math.min(99, previousQuantity + quantity));
  recordRecentPurchase(deal.slug);
  trySyncCartAdd(deal.slug, quantity);
  return { success: true, loginRequired: false };
}

/** +1 담기 — stepper / rail + */
export async function incrementDealCartQuantity(
  deal: Deal,
  currentQuantity: number,
): Promise<AddDealToCartResult> {
  incrementCartQuantity(deal, currentQuantity);
  recordRecentPurchase(deal.slug);
  trySyncCartAdd(deal.slug, 1);
  return { success: true, loginRequired: false };
}

/** -1 담기 — stepper - */
export async function decrementDealCartQuantity(
  deal: Deal,
  currentQuantity: number,
): Promise<AddDealToCartResult> {
  const nextQuantity = Math.max(0, currentQuantity - 1);
  decrementCartQuantity(deal, currentQuantity);
  trySyncCartQuantityBySlug(deal.slug, nextQuantity);
  return { success: true, loginRequired: false };
}
