import { DealProductGridSkeleton } from "@/components/deal-card-skeleton";
import { ProductRailSkeleton } from "@/components/ui-skeleton-card";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function CollectionLoading() {
  return (
    <PageShell withBottomNav>
      <div className="sticky top-0 z-30 bg-white">
        <SubHeader backHref="/" title="컬렉션" />
      </div>
      <div aria-busy="true" aria-label="컬렉션 불러오는 중" className={`${ui.pageBody} space-y-4 bg-white`}>
        <div className="h-12 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
        <ProductRailSkeleton count={3} />
        <DealProductGridSkeleton count={6} />
      </div>
    </PageShell>
  );
}
