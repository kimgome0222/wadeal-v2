type DealGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function DealGridSkeleton({
  count = 4,
  className = "",
}: DealGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="overflow-hidden rounded-lg border border-wadeal-line bg-white"
          key={`deal-skeleton-${index}`}
        >
          <div className="aspect-square animate-pulse bg-gray-100" />
          <div className="space-y-2 p-2.5">
            <div className="h-4 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
            <div className="h-1.5 animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
