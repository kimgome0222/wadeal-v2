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
      className="celloh-seller-carousel-item flex flex-none flex-col items-center text-center active:opacity-80"
      href={getSellerPublicProfileHref({ id })}
    >
      <div className="relative flex aspect-square w-[80%] max-w-[72px] min-w-[64px] items-center justify-center overflow-hidden rounded-full bg-[#F5F7F6]">
        {coverImageUrl ?
          <Image
            alt={`${name} 대표 상품`}
            className="object-cover"
            fill
            sizes="72px"
            src={coverImageUrl}
          />
        : (
          <span className="text-[20px] font-bold text-[#2E5E4E]">{name.slice(0, 1)}</span>
        )}
        {showNew ?
          <span className="absolute right-0 top-0 rounded-full bg-[#E28A3B] px-1 py-0.5 text-[8px] font-bold leading-none text-white">
            N
          </span>
        : null}
      </div>
      <p className="mt-2 w-full truncate text-[12px] font-semibold text-[#111111]">{name}</p>
      <p className="mt-0.5 text-[12px] text-[#666666]">⭐ {rating.toFixed(1)}</p>
    </Link>
  );
}
