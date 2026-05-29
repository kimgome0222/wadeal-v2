import { DealGridSkeleton, ProductRailSkeleton } from "@/components/ui-skeleton-card";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

export default function HomeLoading() {
  return (
    <main aria-busy="true" aria-label="홈 불러오는 중" className={`${ui.pageWrap} pb-24 bg-white`}>
      <div className={`space-y-5 bg-white py-6 pt-24 ${ds.page.gutter}`}>
        <div className="celloh-skeleton-shimmer h-11 min-h-[44px] rounded-full border border-[#DDE8E2]" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="celloh-skeleton-shimmer h-8 w-16 shrink-0 rounded-full" key={index} />
          ))}
        </div>
        <div className="celloh-skeleton-shimmer h-20 rounded-xl border border-[#DDE8E2]" />
        <ProductRailSkeleton count={3} />
        <ProductRailSkeleton count={3} />
        <DealGridSkeleton count={4} />
      </div>
    </main>
  );
}
