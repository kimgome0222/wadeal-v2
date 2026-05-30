import Image from "next/image";
import Link from "next/link";

import type { HomeSellerWithCover } from "@/lib/home/build-home-view";
import { getSellerPublicProfileHref } from "@/lib/sellers/routes";

type HomeTopSellerCardProps = {
  seller: HomeSellerWithCover;
};

export function HomeTopSellerCard({ seller }: HomeTopSellerCardProps) {
  return (
    <Link
      className="flex h-[240px] w-[280px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white active:scale-[0.99]"
      href={getSellerPublicProfileHref(seller)}
    >
      <div className="relative h-[140px] w-full shrink-0 bg-[#F5F7F6]">
        {seller.coverImageUrl ?
          <Image
            alt={`${seller.name} 대표 상품`}
            className="object-cover"
            fill
            sizes="280px"
            src={seller.coverImageUrl}
          />
        : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1 p-3">
        <p className="truncate text-[15px] font-semibold text-[#111111]">{seller.name}</p>
        <p className="line-clamp-1 text-[12px] font-medium leading-snug text-[#666666]">
          {seller.tagline}
        </p>
        <p className="text-[13px] font-normal text-[#666666]">
          ⭐ {seller.rating.toFixed(1)}
        </p>
        <p className="text-[13px] font-normal text-[#666666]">
          📦 {seller.totalSales.toLocaleString("ko-KR")}건 판매
        </p>
      </div>
    </Link>
  );
}
