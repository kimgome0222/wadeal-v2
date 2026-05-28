import { DealGridSkeleton } from "@/components/deal-grid-skeleton";
import { ui } from "@/lib/ui";

export default function SavedLoading() {
  return (
    <div className={`${ui.pageBody} space-y-3`}>
      <DealGridSkeleton count={2} />
    </div>
  );
}
