"use client";

import Image from "next/image";
import Link from "next/link";

import { DealCardPriceBlock } from "@/components/deal-card-price-block";
import { DealCardSellerRow } from "@/components/deal-card-seller-row";
import { DealCardMeta } from "@/components/deal-card-meta";
import { SaveDealButton } from "@/components/save-deal-button";
import type { Deal } from "@/lib/deals";
import { isDealSoldOut } from "@/lib/deals";
import { ui } from "@/lib/ui";

type HomeRecommendedDealCardProps = {
  deal: Deal;
};

export function HomeRecommendedDealCard({ deal }: HomeRecommendedDealCardProps) {
  const soldOut = isDealSoldOut(deal);

  return (
    <Link
      className="group block w-[158px] shrink-0 snap-start sm:w-[168px]"
      href={`/product/${deal.slug}`}
    >
      <article className={`${ui.cardInteractive} flex h-full flex-col overflow-hidden`}>
        <div className="relative aspect-square bg-gray-50">
          <Image
            alt={deal.title}
            className="deal-card-image object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.02] group-active:scale-[0.98]"
            fill
            loading="lazy"
            sizes="168px"
            src={deal.imageUrl}
          />
          {soldOut ?
            <span className="absolute bottom-2 left-2 rounded bg-gray-800/85 px-1.5 py-0.5 text-[9px] font-bold text-white">
              품절
            </span>
          : null}
          <SaveDealButton className="absolute right-2 top-2" deal={deal} size="sm" />
        </div>

        <div className="deal-card-body flex flex-1 flex-col gap-1.5 p-3">
          <h3 className="deal-card-title line-clamp-2 min-h-[2.25rem] text-[12px] font-semibold leading-snug text-wadeal-ink">
            {deal.title}
          </h3>
          <div className="deal-card-seller">
            <DealCardSellerRow compact deal={deal} />
          </div>
          <DealCardMeta compact deal={deal} />
          <div className="mt-auto pt-0.5">
            <DealCardPriceBlock compact deal={deal} />
          </div>
        </div>
      </article>
    </Link>
  );
}
