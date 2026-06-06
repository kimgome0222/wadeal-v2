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

/** 홈 판매자 rail — 64px avatar, 4-up width */
export function HomeSellerIconCard({
  id,
  name,
  rating,
  coverImageUrl,
  showNew = false,
}: HomeSellerIconCardProps) {
  return (
    <Link
      className="seller-rail-item flex w-full min-w-0 flex-none snap-start flex-col items-center overflow-visible active:opacity-80"
      href={getSellerPublicProfileHref({ id })}
      role="listitem"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#F5F7F6]">
        {coverImageUrl ?
          <Image
            alt={`${name} 대표 상품`}
            className="object-cover"
            fill
            sizes="64px"
            src={coverImageUrl}
          />
        : (
          <span className="flex h-full w-full items-center justify-center text-[22px] font-bold text-[#2E5E4E]">
            {name.slice(0, 1)}
          </span>
        )}
        {showNew ?
          <span className="absolute right-0.5 top-0.5 rounded-full bg-[#E28A3B] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
            N
          </span>
        : null}
      </div>
      <p className="mt-2 w-full truncate text-center text-[12px] font-semibold text-[#111111]">
        {name}
      </p>
      <p className="mt-0.5 text-center text-[11px] text-[#666666]">⭐ {rating.toFixed(1)}</p>
    </Link>
  );
}
