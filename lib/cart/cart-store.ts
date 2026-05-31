import type { Deal } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import {
  GUEST_CART_CHANGED_EVENT,
  getGuestJoinCartCount,
  getGuestJoinCartQuantityBySlug,
  readGuestJoinCartItems,
  setGuestJoinCartQuantityBySlug,
  type GuestJoinCartItem,
  type GuestJoinCartSnapshot,
} from "@/lib/join-cart/guest-cart-storage";

/** Guest join-cart와 동기화 — 로그인 여부와 무관한 공통 local cart key */
export const CART_STORAGE_KEY = "celloh-guest-join-cart";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  reviewCount?: number;
  rating?: number;
  badgeLabel?: string;
  quantity: number;
};

export function subscribeCart(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(GUEST_CART_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(GUEST_CART_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function dealToCartSnapshot(deal: Deal): GuestJoinCartSnapshot {
  const { applicablePrice } = getTierProgress(deal);
  return {
    productSlug: deal.slug,
    productName: deal.title,
    estimatedUnitPrice: applicablePrice,
    sellerName: deal.brandName?.trim() || "celloh 셀러",
    imageUrl: deal.imageUrl?.trim() || "",
  };
}

function guestItemToCartItem(item: GuestJoinCartItem): CartItem {
  return {
    id: item.id,
    slug: item.productSlug,
    name: item.productName,
    image: item.imageUrl,
    price: item.estimatedUnitPrice,
    quantity: item.quantity,
  };
}

export function getCartItemsSnapshot(): CartItem[] {
  return readGuestJoinCartItems().map(guestItemToCartItem);
}

export function getCartQuantityBySlug(slug: string): number {
  return getGuestJoinCartQuantityBySlug(slug);
}

export function getCartTotalCount(): number {
  return getGuestJoinCartCount();
}

export function getCartTotalPrice(): number {
  return readGuestJoinCartItems().reduce((sum, item) => sum + item.estimatedLineTotal, 0);
}

export function setCartQuantity(deal: Deal, quantity: number) {
  setGuestJoinCartQuantityBySlug(dealToCartSnapshot(deal), quantity);
}

export function incrementCartQuantity(deal: Deal, currentQuantity: number) {
  setCartQuantity(deal, Math.min(99, currentQuantity + 1));
}

export function decrementCartQuantity(deal: Deal, currentQuantity: number) {
  setCartQuantity(deal, Math.max(0, currentQuantity - 1));
}

export function removeCartItemBySlug(slug: string) {
  const item = readGuestJoinCartItems().find((entry) => entry.productSlug === slug);
  if (item) {
    setGuestJoinCartQuantityBySlug(
      {
        productSlug: item.productSlug,
        productName: item.productName,
        estimatedUnitPrice: item.estimatedUnitPrice,
        sellerName: item.sellerName,
        imageUrl: item.imageUrl,
      },
      0,
    );
  }
}

export function addItem(deal: Deal, quantity = 1) {
  const current = getCartQuantityBySlug(deal.slug);
  setCartQuantity(deal, Math.min(99, current + quantity));
}

export function removeItem(slug: string) {
  removeCartItemBySlug(slug);
}

export function increment(slug: string, deal: Deal, currentQuantity?: number) {
  const current = currentQuantity ?? getCartQuantityBySlug(slug);
  incrementCartQuantity(deal, current);
}

export function decrement(slug: string, deal: Deal, currentQuantity?: number) {
  const current = currentQuantity ?? getCartQuantityBySlug(slug);
  decrementCartQuantity(deal, current);
}

export function setQuantity(deal: Deal, quantity: number) {
  setCartQuantity(deal, quantity);
}

export function getTotalPrice() {
  return getCartTotalPrice();
}

/** spec alias */
export function getSubtotal() {
  return getCartTotalPrice();
}

export function getFormattedSubtotal(): string {
  return `${getCartTotalPrice().toLocaleString("ko-KR")}원`;
}

export function getQuantity(productId: string) {
  return getCartQuantityBySlug(productId);
}

export function getTotalCount() {
  return getCartTotalCount();
}

export function clearCart() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(CART_STORAGE_KEY, "[]");
  window.dispatchEvent(new Event(GUEST_CART_CHANGED_EVENT));
}
