"use client";

import { EmptyState } from "@/components/empty-state";
import { RecommendationBasisHint } from "@/components/recommendations/recommendation-basis-hint";
import { HomeRankingSection } from "@/components/home/home-ranking-section";
import { HomeSellerShowcaseCard } from "@/components/home/home-seller-showcase-card";
import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import type { Deal } from "@/lib/deals";
import type { CollectionDefinition } from "@/lib/home/collection-data";
import { getCollectionEmptyState } from "@/lib/copy/home-section-copy";
import {
  resolveCollectionDeals,
  resolveCollectionSellers,
} from "@/lib/home/collection-data";
import { PROMOTION_HOME_SUBTITLES } from "@/lib/promotions/promotion-copy";

type CollectionPageContentProps = {
  catalog: Deal[];
  definition: CollectionDefinition;
};

function CollectionDealGrid({
  catalog,
  definition,
}: {
  catalog: Deal[];
  definition: CollectionDefinition;
}) {
  const deals = resolveCollectionDeals(catalog, definition.slug);
  const empty = getCollectionEmptyState(definition.slug);

  return (
    <>
      {deals.length === 0 ?
        <EmptyState
          actionHref={empty.actionHref}
          actionLabel={empty.actionLabel}
          compact
          description={empty.description}
          title={empty.title}
        />
      : <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6">
          {deals.map((deal) => (
            <li key={deal.slug}>
              <HomeRecommendedDealCard
                deal={deal}
                imageAspect="square"
                promoBadge={definition.resolveBadge?.(deal) ?? null}
                showCouponPrice={definition.showCouponPrice ?? false}
              />
            </li>
          ))}
        </ul>
      }
    </>
  );
}

/** Quick Menu 컬렉션 — 홈 섹션과 동일 데이터 */
export function CollectionPageContent({ catalog, definition }: CollectionPageContentProps) {
  if (definition.kind === "ranking") {
    return (
      <>
        <div className="px-6 pb-3 pt-6">
          <h1 className="text-[22px] font-bold text-[#111111]">{definition.title}</h1>
          <p className="mt-1 text-[13px] text-[#666666]">{definition.description}</p>
        </div>
        <HomeRankingSection catalog={catalog} />
      </>
    );
  }

  if (definition.kind === "sellers") {
    const sellers = resolveCollectionSellers(definition.slug);

    return (
      <div className="pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-6">
        <div className="px-6">
          <h1 className="text-[22px] font-bold text-[#111111]">{definition.title}</h1>
          <p className="mt-1 text-[13px] text-[#666666]">{definition.description}</p>
        </div>
        <div className="mt-6 snap-x snap-mandatory overflow-x-auto no-scrollbar">
          <div className="flex snap-x snap-mandatory gap-4 px-6" role="list">
            {sellers.map((seller) => (
              <HomeSellerShowcaseCard key={seller.id} seller={seller} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (definition.kind === "live") {
    return (
      <div className="px-6 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-6">
        <h1 className="text-[22px] font-bold text-[#111111]">{definition.title}</h1>
        <p className="mt-1 text-[13px] text-[#666666]">{definition.description}</p>
        <p className="mt-6 rounded-2xl border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-5 text-center text-[14px] font-medium text-[#666666]">
          라이브커머스 준비중
        </p>
        <h2 className="mt-8 text-[18px] font-bold text-[#111111]">추천상품</h2>
        <CollectionDealGrid catalog={catalog} definition={definition} />
      </div>
    );
  }

  return (
    <div className="px-6 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-6">
      <h1 className="text-[22px] font-bold text-[#111111]">{definition.title}</h1>
      {definition.badgeLabel ?
        <span className="mt-2 inline-flex rounded-lg bg-[#2E5E4E] px-2 py-1 text-[11px] font-bold text-white">
          {definition.badgeLabel}
        </span>
      : null}
      <p className="mt-1 text-[13px] text-[#666666]">{definition.description}</p>
      {PROMOTION_HOME_SUBTITLES[definition.slug as keyof typeof PROMOTION_HOME_SUBTITLES] ?
        <p className="mt-2 text-[12px] font-semibold text-[#2E5E4E]">
          {PROMOTION_HOME_SUBTITLES[definition.slug as keyof typeof PROMOTION_HOME_SUBTITLES]}
        </p>
      : null}
      {definition.slug === "repurchase" || definition.slug === "seasonal" ?
        <RecommendationBasisHint className="mt-2" />
      : null}
      <CollectionDealGrid catalog={catalog} definition={definition} />
    </div>
  );
}
