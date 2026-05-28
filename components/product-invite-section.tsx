"use client";

import Link from "next/link";

import { ProductShareButton } from "@/components/product-share-button";
import { GroupBuyProgress } from "@/components/group-buy-progress";
import type { Deal } from "@/lib/deals";
import { getDealRemaining } from "@/lib/deals";
import type { ShareMessageContent } from "@/lib/share/types";
import { ui } from "@/lib/ui";

type ProductInviteSectionProps = {
  deal: Deal;
  shareContent: ShareMessageContent;
  referralCode: string | null;
};

export function ProductInviteSection({
  deal,
  shareContent,
  referralCode,
}: ProductInviteSectionProps) {
  const remaining = getDealRemaining(deal);

  return (
    <section className={`${ui.panel} space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-wadeal-ink">친구 초대하고 최저가 달성</p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-wadeal-muted">
            {remaining > 0 ?
              `${remaining}명만 더 모이면 최저가에 구매할 수 있어요.`
            : "목표 인원이 거의 달성됐어요. 마감 전에 친구를 초대해 보세요."}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-wadeal-red px-2 py-1 text-[10px] font-black text-white">
          HOT
        </span>
      </div>
      <GroupBuyProgress deal={deal} showEndsIn showUrgency />
      <div className="flex items-center gap-2">
        <ProductShareButton
          productSlug={deal.slug}
          referralCode={referralCode}
          shareContent={shareContent}
        />
        <Link
          className="flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg bg-wadeal-red px-3 text-[13px] font-black text-white active:opacity-90"
          href={`/join/${deal.slug}`}
        >
          함께 참여하기
        </Link>
      </div>
    </section>
  );
}
