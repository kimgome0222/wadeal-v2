import type { Deal } from "@/lib/deals";
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

export function isDealClosed(
  deal: Pick<Deal, "dealStatus" | "endsAt">,
): boolean {
  if (isDealStatusClosed(deal.dealStatus)) {
    return true;
  }

  return isDealPastDeadline(deal.endsAt);
}

export function canJoinDeal(deal: Pick<Deal, "dealStatus" | "endsAt">): boolean {
  return !isDealClosed(deal);
}
