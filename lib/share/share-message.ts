import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import type { ShareMessageContent } from "@/lib/share/types";
import { buildShareUrl } from "@/lib/share/urls";

export function buildShareMessageContent(
  deal: Deal,
  referralCode?: string | null,
  origin?: string,
): ShareMessageContent {
  const { applicablePrice, lowestPrice, qtyUntilNextTier, allTiersAchieved } =
    getTierProgress(deal);
  const shareUrl = buildShareUrl(deal.slug, referralCode, origin);

  const tierLine =
    allTiersAchieved ?
      `최저가 ${currency.format(lowestPrice)}원 달성!`
    : `${qtyUntilNextTier}명 더 모이면 추가 할인 · 최저 ${currency.format(lowestPrice)}원`;

  const description = [
    `현재 공동구매가 ${currency.format(applicablePrice)}원`,
    tierLine,
    "함께 참여하면 더 저렴해져요!",
  ].join("\n");

  return {
    title: deal.title,
    description,
    shareUrl,
    imageUrl: deal.imageUrl,
  };
}
