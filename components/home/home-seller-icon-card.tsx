import Image from "next/image";
import Link from "next/link";

import { getSellerPublicProfileHref } from "@/lib/sellers/routes";

type HomeSellerIconCardProps = {
  id: string;
  name: string;
  rating: number;
  coverImageUrl?: string;
  showNew?: boolean;
};

/** 홈 추천 판매자 — 4-up 아이콘 카드 */
export function HomeSellerIconCard({
  id,
  name,
  rating,
  coverImageUrl,
  showNew = false,
}: HomeSellerIconCardProps) {
  return (
    <Link
      className="seller-rail-item flex flex-none flex-col items-center text-center active:opacity-80"
      href={getSellerPublicProfileHref({ id })}
      role="listitem"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#F5F7F6] min-[390px]:h-[68px] min-[390px]:w-[68px]">
        {coverImageUrl ?
          <Image
            alt={`${name} 대표 상품`}
            className="object-cover"
            fill
            sizes="68px"
            src={coverImageUrl}
          />
        : (
          <span className="flex h-full w-full items-center justify-center text-[20px] font-bold text-[#2E5E4E]">
            {name.slice(0, 1)}
          </span>
        )}
        {showNew ?
          <span className="absolute right-0 top-0 rounded-full bg-[#E28A3B] px-1 py-0.5 text-[8px] font-bold leading-none text-white">
            N
          </span>
        : null}
      </div>
      <p className="mt-2 w-full truncate text-[12px] font-semibold text-[#111111]">{name}</p>
      <p className="mt-0.5 text-[11px] text-[#666666]">⭐ {rating.toFixed(1)}</p>
    </Link>
  );
}
