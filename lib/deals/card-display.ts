import type { Deal } from "@/lib/deals";

export function getDealTodayParticipantLabel(deal: Deal): string {
  const sold = deal.soldQuantity ?? 0;
  const active = Math.max(deal.participants, sold);
  return `${active.toLocaleString("ko-KR")}명 구매 중`;
}

export function getDealReviewScoreLabel(deal: Deal): { score: string; count: number } {
  const count = Math.max(1, Math.round(deal.participants / 3));
  const score = Math.min(5, 4 + deal.participants / 120).toFixed(1);
  return { score, count };
}

export function getDealRemainingLabel(deal: Deal): string | null {
  const remaining = Math.max(0, deal.targetParticipants - deal.participants);
  if (remaining <= 0) {
    return null;
  }

  return "판매 중 · 혜택 확인";
}
