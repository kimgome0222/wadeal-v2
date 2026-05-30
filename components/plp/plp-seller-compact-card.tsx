import Link from "next/link";

import { getSellerPublicProfileHref } from "@/lib/sellers/routes";
import type { SellerProfile } from "@/lib/sellers/types";

/** PLP 추천 판매자 — 4-up compact, avatar 64px */
export function PlpSellerCompactCard({ seller }: { seller: SellerProfile }) {
  return (
    <Link
      className="plp-seller-rail-item flex flex-none snap-start flex-col items-center overflow-visible text-center active:opacity-80"
      href={getSellerPublicProfileHref(seller)}
      role="listitem"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F5F7F6] text-[22px] font-bold text-[#2E5E4E]">
        {seller.name.slice(0, 1)}
      </div>
      <p className="mt-2 w-full truncate text-[12px] font-semibold text-[#111111]">{seller.name}</p>
      <p className="mt-0.5 text-[11px] text-[#666666]">⭐ {seller.rating.toFixed(1)}</p>
    </Link>
  );
}
