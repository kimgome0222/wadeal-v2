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

/** 홈 판매자 rail — 상품카드와 동일 4:5 · radius 18px, 4-up width */
export function HomeSellerIconCard({
  id,
  name,
  rating,
  coverImageUrl,
  showNew = false,
}: HomeSellerIconCardProps) {
  return (
    <Link
      className="seller-rail-item flex w-full min-w-0 flex-none snap-start flex-col overflow-visible active:opacity-80"
      href={getSellerPublicProfileHref({ id })}
      role="listitem"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[#F5F7F6]">
        {coverImageUrl ?
          <Image
            alt={`${name} 대표 상품`}
            className="object-cover"
            fill
            sizes="(max-width: 430px) calc((100vw - 96px) / 4), 80px"
            src={coverImageUrl}
          />
        : (
          <span className="flex h-full w-full items-center justify-center text-[24px] font-bold text-[#2E5E4E]">
            {name.slice(0, 1)}
          </span>
        )}
        {showNew ?
          <span className="absolute right-2 top-2 rounded-full bg-[#E28A3B] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
            N
          </span>
        : null}
      </div>
      <p className="mt-2 w-full truncate text-[12px] font-semibold text-[#111111]">{name}</p>
      <p className="mt-0.5 text-[13px] text-[#666666]">⭐ {rating.toFixed(1)}</p>
    </Link>
  );
}
