import { DealGridSkeleton } from "@/components/deal-grid-skeleton";
import { ProductRailSkeleton } from "@/components/ui-skeleton-card";
import { ui } from "@/lib/ui";

export default function HomeLoading() {
  return (
    <main className={`${ui.pageWrap} pb-24 shadow-soft`}>
      <div className="space-y-4 bg-white px-4 py-3 pt-24">
        <ProductRailSkeleton count={4} />
        <DealGridSkeleton count={4} />
      </div>
    </main>
  );
}
