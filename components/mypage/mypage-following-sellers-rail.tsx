"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getFollowedSellers, SELLER_FOLLOW_EVENTS } from "@/lib/sellers/follow-storage";
import { getSellerPublicProfileHref } from "@/lib/sellers/routes";

type SellerPreview = {
  id: string;
  name: string;
  rating: number;
  totalSales: number;
};

type MypageFollowingSellersRailProps = {
  fallbackSellers: SellerPreview[];
};

export function MypageFollowingSellersRail({
  fallbackSellers,
}: MypageFollowingSellersRailProps) {
  const [followed, setFollowed] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    function sync() {
      setFollowed(getFollowedSellers().slice(0, 10));
    }

    sync();
    window.addEventListener(SELLER_FOLLOW_EVENTS.updated, sync);
    return () => window.removeEventListener(SELLER_FOLLOW_EVENTS.updated, sync);
  }, []);

  const sellers: SellerPreview[] =
    followed.length > 0 ?
      followed.map((item) => {
        const match = fallbackSellers.find((seller) => seller.id === item.id);
        return {
          id: item.id,
          name: item.name,
          rating: match?.rating ?? 4.8,
          totalSales: match?.totalSales ?? 0,
        };
      })
    : fallbackSellers.slice(0, 10);

  if (sellers.length === 0) {
    return (
      <section className="space-y-4 px-6 pt-10">
        <h2 className="text-[20px] font-bold text-[#111111]">찜 판매자</h2>
        <p className="rounded-[20px] bg-[#F5F7F6] py-8 text-center text-[14px] text-[#666666]">
          팔로우한 판매자가 없어요.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 pt-10">
      <div className="flex items-end justify-between gap-3 px-6">
        <h2 className="text-[20px] font-bold text-[#111111]">찜 판매자</h2>
        <Link className="text-[13px] font-medium text-[#666666]" href="/mypage/following-sellers">
          더보기
        </Link>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-6 pb-0.5">
        {sellers.map((seller) => (
          <Link
            className="flex w-[160px] shrink-0 flex-col gap-2 rounded-[20px] border border-[#E8ECEA] bg-white p-4 active:bg-[#FAFBFA]"
            href={getSellerPublicProfileHref({ id: seller.id })}
            key={seller.id}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E5E4E] text-[18px] font-bold text-white">
              {seller.name.slice(0, 1)}
            </div>
            <p className="truncate text-[14px] font-semibold text-[#111111]">{seller.name}</p>
            <p className="text-[12px] text-[#666666]">⭐ {seller.rating.toFixed(1)}</p>
            <p className="text-[12px] text-[#666666]">
              판매 {seller.totalSales.toLocaleString("ko-KR")}건
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
