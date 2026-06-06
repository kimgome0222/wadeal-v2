"use client";

import Link from "next/link";

import { ProductShareButton } from "@/components/product-share-button";
import { GroupBuyProgress } from "@/components/group-buy-progress";
import type { Deal } from "@/lib/deals";
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
  return (
    <section className={`${ui.panel} space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-wadeal-ink">친구에게 celloh 소개하기</p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-wadeal-muted">
            좋은 판매자를 발견하고, 마음에 드는 상품을 공유해 보세요.
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-wadeal-coral px-2 py-1 text-[10px] font-black text-white">
          NEW
        </span>
      </div>
      <GroupBuyProgress deal={deal} showEndsIn showUrgency={false} />
      <div className="flex items-center gap-2">
        <ProductShareButton
          productSlug={deal.slug}
          referralCode={referralCode}
          shareContent={shareContent}
        />
          <Link
            className={`${ui.btnCompact} flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center px-3 text-[13px]`}
            href={`/join/${deal.slug}`}
          >
            구매하기
          </Link>
      </div>
    </section>
  );
}
