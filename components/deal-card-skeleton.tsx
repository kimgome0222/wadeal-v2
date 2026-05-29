import { DealGridSkeleton, SkeletonCard } from "@/components/ui-skeleton-card";

/** @deprecated Use SkeletonCard */
export function DealCardSkeleton() {
  return <SkeletonCard />;
}

export function DealProductGridSkeleton({ count = 6 }: { count?: number }) {
  return <DealGridSkeleton count={count} />;
}
