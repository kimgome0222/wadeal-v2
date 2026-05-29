export function DealCardSkeleton() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-xl border border-wadeal-line bg-white shadow-card"
    >
      <div className="m-2 mb-0 aspect-square animate-pulse rounded-lg bg-gray-100" />
      <div className="space-y-2 p-2.5 pt-2">
        <div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
        <div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
      </div>
    </div>
  );
}

export function DealProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <DealCardSkeleton key={index} />
      ))}
    </div>
  );
}
