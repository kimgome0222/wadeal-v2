import Image from "next/image";
import Link from "next/link";

import { getSellerPublicProfileHref } from "@/lib/sellers/routes";
import { currency } from "@/lib/deals";
import type { SellerShowcaseItem } from "@/lib/home/seller-showcase-mock";

const PLACEHOLDER = "/wadeal-wordmark.svg";

type HomeSellerShowcaseCardProps = {
  seller: SellerShowcaseItem;
};

/** 신규/인기 판매자 — 소개글 + 대표 상품 1개 */
export function HomeSellerShowcaseCard({ seller }: HomeSellerShowcaseCardProps) {
  const href = getSellerPublicProfileHref({ id: seller.id });

  return (
    <Link
      aria-label={`${seller.name} 판매자 프로필 보기`}
      className="seller-showcase-item flex min-w-0 flex-none snap-start cursor-pointer flex-col rounded-[20px] border border-[#E8ECEA] bg-white p-4 active:scale-[0.99]"
      href={href}
      role="listitem"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-[#F5F7F6]">
          {seller.productImageUrl ?
            <Image
              alt={`${seller.name} 대표 이미지`}
              className="object-cover"
              fill
              sizes="48px"
              src={seller.productImageUrl}
            />
          : (
            <span className="flex h-full w-full items-center justify-center text-[18px] font-bold text-[#2E5E4E]">
              {seller.name.slice(0, 1)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-[#111111]">{seller.name}</p>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#666666]">{seller.intro}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#FAFBFA] p-2.5">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-[#F5F7F6]">
          <Image
            alt={seller.productName?.trim() || `${seller.name} 대표 상품`}
            className="object-cover"
            fill
            sizes="72px"
            src={seller.productImageUrl || PLACEHOLDER}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[13px] font-semibold text-[#111111]">{seller.productName}</p>
          <p className="mt-1 text-[14px] font-bold tabular-nums text-[#111111]">
            {currency.format(seller.productPrice)}원
          </p>
        </div>
      </div>

      <span className="mt-3 text-[13px] font-semibold text-[#2E5E4E]">판매자 보러가기</span>
    </Link>
  );
}
