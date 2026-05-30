import Link from "next/link";

import { getSellerPublicProfileHref } from "@/lib/sellers/routes";
import type { SellerProfile } from "@/lib/sellers/types";

type PlpRecommendedSellersProps = {
  sellers: SellerProfile[];
  title?: string;
  className?: string;
};

export function PlpRecommendedSellerCard({ seller }: { seller: SellerProfile }) {
  return (
    <Link
      className="flex h-[140px] w-[240px] shrink-0 flex-col justify-between rounded-[20px] border border-[#E8ECEA] bg-white p-3 active:scale-[0.99]"
      href={getSellerPublicProfileHref(seller)}
    >
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold text-[#111111]">{seller.name}</p>
        <p className="mt-1 line-clamp-2 text-[12px] font-medium leading-snug text-[#666666]">
          {seller.tagline}
        </p>
      </div>
      <div className="space-y-0.5">
        <p className="text-[12px] text-[#666666]">⭐ {seller.rating.toFixed(1)}</p>
        <p className="text-[12px] text-[#666666]">
          📦 {seller.totalSales.toLocaleString("ko-KR")}건 판매
        </p>
      </div>
    </Link>
  );
}

export function PlpRecommendedSellers({
  sellers,
  title = "추천 판매자",
  className = "",
}: PlpRecommendedSellersProps) {
  if (sellers.length === 0) {
    return null;
  }

  return (
    <section aria-label={title} className={`relative z-10 space-y-4 ${className}`}>
      <h2 className="text-[20px] font-bold text-[#111111]">{title}</h2>
      <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-0.5">
        {sellers.map((seller) => (
          <PlpRecommendedSellerCard key={seller.id} seller={seller} />
        ))}
      </div>
    </section>
  );
}
