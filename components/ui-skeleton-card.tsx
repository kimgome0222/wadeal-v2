import { ui } from "@/lib/ui";

type SkeletonCardProps = {
  className?: string;
  aspect?: "square" | "line";
};

/** 부드러운 shimmer — 과한 애니메이션 없음. */
export function SkeletonCard({ className = "", aspect = "square" }: SkeletonCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-wadeal-line bg-white ${className}`}
    >
      <div
        className={`animate-pulse bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 ${
          aspect === "square" ? "aspect-square" : "h-4"
        }`}
      />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

type ProductRailSkeletonProps = {
  count?: number;
};

export function ProductRailSkeleton({ count = 3 }: ProductRailSkeletonProps) {
  return (
    <div className="celloh-rail-scroll no-scrollbar flex gap-3 overflow-x-auto pb-1">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard className="w-[158px] shrink-0 sm:w-[168px]" key={index} />
      ))}
    </div>
  );
}

type SellerTrustSkeletonProps = {
  className?: string;
};

export function SellerTrustSkeleton({ className = "" }: SellerTrustSkeletonProps) {
  return (
    <div className={`${ui.card} space-y-3 p-4 ${className}`}>
      <div className="flex gap-3">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-100" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-12 animate-pulse rounded-xl bg-gray-50" key={index} />
        ))}
      </div>
    </div>
  );
}
