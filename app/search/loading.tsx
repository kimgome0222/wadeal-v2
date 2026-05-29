import { DealProductGridSkeleton } from "@/components/deal-card-skeleton";
import { PageShell } from "@/components/page-shell";
import { SearchHeader } from "@/components/search-header";
import { ui } from "@/lib/ui";

export default function SearchLoading() {
  return (
    <PageShell withBottomNav>
      <div className="sticky top-0 z-30 bg-white">
        <SearchHeader backHref="/" />
        <div className="h-11 celloh-skeleton-shimmer border-b border-[#DDE8E2]" />
        <div className="h-11 celloh-skeleton-shimmer border-b border-[#DDE8E2]" />
      </div>
      <div className={`${ui.pageBody} space-y-4 bg-white`}>
        <div className="h-16 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
        <DealProductGridSkeleton count={6} />
      </div>
    </PageShell>
  );
}
