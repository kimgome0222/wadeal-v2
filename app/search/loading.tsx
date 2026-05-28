import { DealGridSkeleton } from "@/components/deal-grid-skeleton";
import { ui } from "@/lib/ui";

export default function SearchLoading() {
  return (
    <div className={`${ui.pageBody} bg-wadeal-surface pt-4`}>
      <DealGridSkeleton count={6} />
    </div>
  );
}
