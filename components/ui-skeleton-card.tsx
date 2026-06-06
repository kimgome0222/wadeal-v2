import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type SkeletonCardProps = {
  className?: string;
  aspect?: "square" | "portrait" | "line";
};

/** Phase 3/4 unified skeleton — shimmer, border #DDE8E2, aspect 3/4 cards */
export function SkeletonCard({ className = "", aspect = "portrait" }: SkeletonCardProps) {
  const aspectClass =
    aspect === "square" ? "aspect-square"
    : aspect === "portrait" ? "aspect-[3/4]"
    : "h-3";

  return (
    <div aria-hidden className={`${ds.skeleton.card} ${className}`.trim()}>
      <div className={`celloh-skeleton-shimmer ${aspectClass}`} />
      {aspect !== "line" ?
        <div className="space-y-2 p-3">
          <div className="celloh-skeleton-shimmer h-3 w-3/4 rounded" />
          <div className="celloh-skeleton-shimmer h-3 w-1/2 rounded" />
          <div className="celloh-skeleton-shimmer h-3 w-2/5 rounded" />
        </div>
      : null}
    </div>
  );
}

type ProductRailSkeletonProps = {
  count?: number;
};

export function ProductRailSkeleton({ count = 3 }: ProductRailSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="상품 불러오는 중"
      className="celloh-rail-scroll no-scrollbar flex gap-3 overflow-x-auto pb-1"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard className="w-[158px] shrink-0 sm:w-[168px]" key={index} />
      ))}
    </div>
  );
}

type DealGridSkeletonProps = {
  count?: number;
  className?: string;
  columns?: "2" | "3";
};

export function DealGridSkeleton({
  count = 4,
  className = "",
  columns = "2",
}: DealGridSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="상품 목록 불러오는 중"
      className={`grid gap-2 ${columns === "3" ? "grid-cols-2 sm:grid-cols-3 sm:gap-2.5" : "grid-cols-2"} ${className}`.trim()}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={`deal-skeleton-${index}`} />
      ))}
    </div>
  );
}

type SellerTrustSkeletonProps = {
  className?: string;
};

export function SellerTrustSkeleton({ className = "" }: SellerTrustSkeletonProps) {
  return (
    <div aria-busy="true" className={`${ui.card} space-y-3 p-4 ${className}`}>
      <div className="flex gap-3">
        <div className={`celloh-skeleton-shimmer ${ds.skeleton.avatar} h-12 w-12 shrink-0`} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="celloh-skeleton-shimmer h-3 w-2/3 rounded" />
          <div className="celloh-skeleton-shimmer h-3 w-full rounded" />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="h-12 rounded-lg border border-[#DDE8E2] celloh-skeleton-shimmer" key={index} />
        ))}
      </div>
    </div>
  );
}

/** 상품 상세 페이지 skeleton */
export function ProductDetailSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="상품 상세 불러오는 중"
      className={`${ui.pageWrap} pb-[calc(5.5rem+env(safe-area-inset-bottom))] bg-white`}
    >
      <div className={`${ds.chrome.subHeader} flex items-center gap-2 px-3`}>
        <div className="celloh-skeleton-shimmer h-9 w-9 rounded-lg" />
        <div className="celloh-skeleton-shimmer mx-auto h-4 w-24 rounded" />
        <div className="h-9 w-9" />
      </div>

      <div className="aspect-[3/4] w-full celloh-skeleton-shimmer bg-[#F8FAF8]" />

      <div className={`space-y-3 px-5 py-4 ${ds.page.stackSm}`}>
        <div className="celloh-skeleton-shimmer h-5 w-4/5 rounded" />
        <div className="celloh-skeleton-shimmer h-3 w-1/2 rounded" />
        <div className="celloh-skeleton-shimmer h-4 w-1/3 rounded" />
        <div className="flex gap-2">
          <div className="celloh-skeleton-shimmer h-11 min-h-[44px] flex-1 rounded-xl" />
          <div className="celloh-skeleton-shimmer h-11 min-h-[44px] w-24 rounded-xl" />
        </div>
      </div>

      <div className={`${ui.pageBody} space-y-3 !py-3`}>
        <div className="h-24 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
      </div>

      <div className="aspect-[4/5] w-full celloh-skeleton-shimmer bg-[#F8FAF8]" />

      <div className={`${ui.pageBody} ${ds.page.sectionGap} pt-4`}>
        <div className="h-40 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
        <div className="h-32 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
        <div className="h-48 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
      </div>

      <div className={`${ui.stickyFooter} flex items-center gap-2`}>
        <div className="celloh-skeleton-shimmer h-10 min-h-[44px] flex-1 rounded-xl" />
        <div className="celloh-skeleton-shimmer h-10 min-h-[44px] w-20 rounded-xl" />
      </div>
    </main>
  );
}

/** 판매자 프로필 skeleton */
export function SellerProfileSkeleton() {
  return (
    <div aria-busy="true" aria-label="판매자 프로필 불러오는 중" className={`${ds.page.sectionGap} pb-[calc(5rem+env(safe-area-inset-bottom))]`}>
      <div className="h-28 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer bg-[#FAFBFA]" />
      <div className="h-24 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
      <div className="h-11 celloh-skeleton-shimmer rounded-none border-b border-[#DDE8E2]" />
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="celloh-skeleton-shimmer h-11 min-h-[44px] rounded-xl" key={index} />
        ))}
      </div>
      <DealGridSkeleton columns="3" count={6} />
      <div className="space-y-2">
        <div className="celloh-skeleton-shimmer h-4 w-24 rounded" />
        <div className="h-24 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
        <div className="h-24 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
      </div>
      <div className="h-20 rounded-xl border border-[#DDE8E2] celloh-skeleton-shimmer" />
      <div className={`${ui.stickyFooter} grid grid-cols-3 gap-1.5`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="celloh-skeleton-shimmer h-11 min-h-[44px] rounded-xl" key={index} />
        ))}
      </div>
    </div>
  );
}
