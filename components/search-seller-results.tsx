import Link from "next/link";

import { SellerProfileAvatar } from "@/components/seller-profile-avatar";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import { getSellerSearchHref } from "@/lib/sellers/routes";
import type { SellerProfile } from "@/lib/sellers/types";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { sellerInteractiveClass } from "@/lib/sellers/trust-display";
import { ui } from "@/lib/ui";

type SearchSellerResultsProps = {
  sellers: SellerProfile[];
  query: string;
};

export function SearchSellerResults({ sellers, query }: SearchSellerResultsProps) {
  if (sellers.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2.5">
      <div>
        <h2 className="text-[13px] font-bold text-wadeal-ink">판매자</h2>
        <p className="mt-0.5 text-[11px] font-medium text-wadeal-muted">
          &apos;{query}&apos;와 관련된 판매자입니다.
        </p>
      </div>
      <ul className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sellers.map((seller) => (
          <li key={seller.id}>
            <Link
              className={`${ui.card} flex w-[220px] shrink-0 items-start gap-2.5 p-3 celloh-transition hover:-translate-y-0.5 hover:shadow-card`}
              href={getSellerSearchHref(seller)}
            >
              <SellerProfileAvatar name={seller.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className={`truncate text-xs font-black ${sellerInteractiveClass}`}>
                    {seller.name}
                  </span>
                  {seller.isVerified ?
                    <SellerVerifiedChip label={SELLER_UI_COPY.verifiedBadge} />
                  : null}
                </div>
                <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-relaxed text-wadeal-muted">
                  {seller.tagline}
                </p>
                <p className="mt-1.5 text-[10px] font-bold text-wadeal-muted">
                  ★ {seller.rating.toFixed(1)} · 리뷰 {seller.reviewCount.toLocaleString("ko-KR")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
