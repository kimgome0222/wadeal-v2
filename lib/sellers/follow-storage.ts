import type { SellerProfile } from "@/lib/sellers/types";

const FOLLOW_KEY = "celloh_followed_sellers_v1";

/** TODO(DB): seller_follows (user_id, seller_id) 테이블 + API로 교체 */

export type FollowedSellerSnapshot = {
  id: string;
  name: string;
  tagline: string;
  followedAt: string;
};

export const SELLER_FOLLOW_EVENTS = {
  updated: "celloh:seller-follow-updated",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function readFollowed(): FollowedSellerSnapshot[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FOLLOW_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as FollowedSellerSnapshot[];
  } catch {
    return [];
  }
}

function writeFollowed(items: FollowedSellerSnapshot[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(FOLLOW_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(SELLER_FOLLOW_EVENTS.updated));
}

export function sellerToFollowSnapshot(seller: Pick<SellerProfile, "id" | "name" | "tagline">): FollowedSellerSnapshot {
  return {
    id: seller.id,
    name: seller.name,
    tagline: seller.tagline,
    followedAt: new Date().toISOString(),
  };
}

export function getFollowedSellers(): FollowedSellerSnapshot[] {
  return readFollowed();
}

export function isSellerFollowed(sellerId: string): boolean {
  return readFollowed().some((item) => item.id === sellerId);
}

export function followSeller(seller: Pick<SellerProfile, "id" | "name" | "tagline">): boolean {
  const current = readFollowed();
  if (current.some((item) => item.id === seller.id)) {
    return true;
  }

  writeFollowed([sellerToFollowSnapshot(seller), ...current]);
  return true;
}

export function unfollowSeller(sellerId: string): void {
  writeFollowed(readFollowed().filter((item) => item.id !== sellerId));
}

export function toggleSellerFollow(
  seller: Pick<SellerProfile, "id" | "name" | "tagline">,
): boolean {
  if (isSellerFollowed(seller.id)) {
    unfollowSeller(seller.id);
    return false;
  }

  followSeller(seller);
  return true;
}
