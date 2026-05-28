import type { Deal } from "@/lib/deals";
import {
  formatRemainingStockLabel,
  inventoryFromDeal,
  isSoldOut,
} from "@/lib/products/inventory";
import type { DealStatus } from "@/lib/types";

const CLOSED_STATUSES: DealStatus[] = ["closed", "cancelled"];

export function isDealPastDeadline(endsAt: string | undefined | null): boolean {
  if (!endsAt) {
    return false;
  }

  const deadlineMs = new Date(endsAt).getTime();
  if (Number.isNaN(deadlineMs)) {
    return false;
  }

  return deadlineMs <= Date.now();
}

export function isDealStatusClosed(dealStatus: string | undefined | null): boolean {
  if (!dealStatus) {
    return false;
  }

  return CLOSED_STATUSES.includes(dealStatus as DealStatus);
}

/** 판매자가 수량 한도를 둔 경우에만 true (무제한이면 false) */
export function hasDealQuantityCap(
  deal: Pick<
    Deal,
    | "productType"
    | "stockQuantity"
    | "soldQuantity"
    | "targetQuantity"
    | "currentQuantity"
    | "maxQuantity"
  >,
): boolean {
  const inventory = inventoryFromDeal(deal);
  if (inventory.productType === "normal") {
    return inventory.stockQuantity != null;
  }

  return inventory.maxQuantity != null || inventory.targetQuantity != null;
}

/**
 * 구매 불가 = 관리자 종료/취소 또는 (한정 수량 + 품절).
 * 시간 마감(ends_at)만으로는 구매를 막지 않습니다.
 */
export function isDealClosed(deal: Deal): boolean {
  if (isDealStatusClosed(deal.dealStatus)) {
    return true;
  }

  if (!hasDealQuantityCap(deal)) {
    return false;
  }

  return isSoldOut(inventoryFromDeal(deal));
}

export function canJoinDeal(deal: Deal): boolean {
  return !isDealClosed(deal);
}

/** 카드/상세에 시간 카운트다운 표시 여부 — Wadeal은 기본 숨김 */
export function shouldShowDealDeadline(_deal: Deal): boolean {
  return false;
}

/** 한정 수량일 때만 "N개 남음" 등 표시 */
export function getDealAvailabilityLabel(deal: Deal): string | null {
  if (!hasDealQuantityCap(deal)) {
    return null;
  }

  return formatRemainingStockLabel(inventoryFromDeal(deal));
}
