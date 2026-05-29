import Link from "next/link";

import { SellerProfileAvatar } from "@/components/seller-profile-avatar";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import { ds } from "@/lib/design-system";
import {
  getSellerPublicProfileHref,
  getSellerSearchHref,
  isSellerPublicProfileEnabled,
} from "@/lib/sellers/routes";
import type { SellerProfile } from "@/lib/sellers/types";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";

type SearchSellerResultsProps = {
  sellers: SellerProfile[];
  query: string;
};

export function SearchSellerResults({ sellers, query }: SearchSellerResultsProps) {
  if (sellers.length === 0) {
    return null;
  }

  return (
    <section aria-label="판매자 검색 결과" className="space-y-3">
      <div>
        <h2 className={ds.type.h2}>판매자</h2>
        <p className={`mt-0.5 ${ds.type.caption}`}>
          &apos;{query}&apos; 관련 판매자 {sellers.length.toLocaleString("ko-KR")}명
        </p>
      </div>
      <ul className="space-y-2 sm:hidden">
        {sellers.map((seller) => {
          const href =
            isSellerPublicProfileEnabled() ?
              getSellerPublicProfileHref(seller)
            : getSellerSearchHref(seller);

          return (
            <li key={seller.id}>
              <Link
                className={`${ds.card.interactive} flex min-h-[72px] items-start gap-3 p-3`}
                href={href}
              >
                <SellerProfileAvatar name={seller.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className={`truncate ${ds.type.h2}`}>{seller.name}</span>
                    {seller.isVerified ?
                      <SellerVerifiedChip label={SELLER_UI_COPY.verifiedBadge} />
                    : null}
                  </div>
                  <p className={`mt-1 line-clamp-2 ${ds.type.bodySm}`}>{seller.tagline}</p>
                  <p className={`mt-1.5 ${ds.type.meta}`}>
                    <span className={ds.type.star}>★</span> {seller.rating.toFixed(1)} · 리뷰{" "}
                    {seller.reviewCount.toLocaleString("ko-KR")}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="no-scrollbar hidden gap-2 overflow-x-auto pb-1 sm:flex">
        {sellers.map((seller) => {
          const href =
            isSellerPublicProfileEnabled() ?
              getSellerPublicProfileHref(seller)
            : getSellerSearchHref(seller);

          return (
            <li key={seller.id}>
              <Link
                className={`${ds.card.interactive} flex w-[220px] shrink-0 items-start gap-2.5 p-3`}
                href={href}
              >
                <SellerProfileAvatar name={seller.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className={`truncate ${ds.type.h3}`}>{seller.name}</span>
                    {seller.isVerified ?
                      <SellerVerifiedChip label={SELLER_UI_COPY.verifiedBadge} />
                    : null}
                  </div>
                  <p className={`mt-1 line-clamp-2 ${ds.type.meta} leading-relaxed`}>
                    {seller.tagline}
                  </p>
                  <p className={`mt-1.5 ${ds.type.meta}`}>
                    <span className={ds.type.star}>★</span> {seller.rating.toFixed(1)} · 리뷰{" "}
                    {seller.reviewCount.toLocaleString("ko-KR")}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
