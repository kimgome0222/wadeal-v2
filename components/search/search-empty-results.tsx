import { DealCard } from "@/components/deal-card";
import { EmptyState } from "@/components/empty-state";
import { ds } from "@/lib/design-system";
import type { Deal } from "@/lib/deals";

type SearchEmptyResultsProps = {
  query: string;
  similarDeals: Deal[];
};

export function SearchEmptyResults({ query, similarDeals }: SearchEmptyResultsProps) {
  return (
    <div className="space-y-6">
      <EmptyState
        description={`'${query}'에 맞는 상품이 없어요. 다른 키워드로 다시 검색해 보세요.`}
        title="원하는 상품을 찾지 못했어요."
        variant="search"
      />

      {similarDeals.length > 0 ?
        <section className="space-y-3" id="similar-products">
          <div>
            <h2 className={ds.type.h2}>비슷한 상품 보기</h2>
            <p className={`mt-0.5 ${ds.type.caption}`}>
              지금 많이 찾는 인기 상품을 추천해 드려요.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {similarDeals.map((deal) => (
              <DealCard deal={deal} key={deal.slug} />
            ))}
          </div>
        </section>
      : null}
    </div>
  );
}
