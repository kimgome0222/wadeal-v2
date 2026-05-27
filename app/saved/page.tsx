import { BottomNavigation } from "@/components/bottom-navigation";
import { DealCard } from "@/components/deal-card";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getSavedDeals } from "@/lib/deals";
import { ui } from "@/lib/ui";

export default function SavedPage() {
  const savedDeals = getSavedDeals();

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title="찜한 상품" />
      <div className={`${ui.pageBody} bg-wadeal-surface`}>
        {savedDeals.length > 0 ?
          <div className="grid grid-cols-2 gap-2">
            {savedDeals.map((deal) => (
              <DealCard deal={deal} key={deal.slug} />
            ))}
          </div>
        : <p className="py-16 text-center text-sm font-bold text-wadeal-muted">
            찜한 상품이 없어요.
          </p>
        }
      </div>
      <BottomNavigation />
    </PageShell>
  );
}
