import { DealProductGridSkeleton } from "@/components/deal-card-skeleton";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function CategoryLoading() {
  return (
    <PageShell withBottomNav>
      <div className="sticky top-0 z-30 bg-white">
        <SubHeader backHref="/" title="카테고리" />
        <div className="h-11 animate-pulse border-b border-wadeal-line bg-gray-50" />
        <div className="h-11 animate-pulse border-b border-wadeal-line bg-gray-50" />
      </div>
      <div className={`${ui.pageBody} space-y-4 bg-wadeal-surface`}>
        <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
        <DealProductGridSkeleton count={6} />
      </div>
    </PageShell>
  );
}
