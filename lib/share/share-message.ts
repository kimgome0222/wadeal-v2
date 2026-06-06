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
      `혜택가 ${currency.format(lowestPrice)}원 적용`
    : `${qtyUntilNextTier}개 더 구매 시 추가 혜택 · 혜택가 ${currency.format(lowestPrice)}원`;

  const description = [
    `현재 혜택가 ${currency.format(applicablePrice)}원`,
    tierLine,
    "celloh · 좋은 판매자의 상품을 함께 발견해보세요.",
  ].join("\n");

  return {
    title: deal.title,
    description,
    shareUrl,
    imageUrl: deal.imageUrl,
  };
}
