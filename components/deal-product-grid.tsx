import { DealCard } from "@/components/deal-card";
import { EmptyState } from "@/components/empty-state";
import type { Deal } from "@/lib/deals";
import { ds } from "@/lib/design-system";

type DealProductGridProps = {
  deals: Deal[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function DealProductGrid({
  deals,
  emptyTitle = "상품이 없어요.",
  emptyDescription,
}: DealProductGridProps) {
  if (deals.length === 0) {
    return (
      <EmptyState
        description={emptyDescription}
        title={emptyTitle}
      />
    );
  }

  return (
    <div className={ds.spacing.productGrid}>
      {deals.map((deal) => (
        <DealCard deal={deal} key={deal.slug} />
      ))}
    </div>
  );
}
