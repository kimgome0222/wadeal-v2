import Link from "next/link";

import { SellerProfileAvatar } from "@/components/seller-profile-avatar";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import { getSellerSearchHref } from "@/lib/sellers/routes";
import type { SellerProfile } from "@/lib/sellers/types";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

type CategoryPopularSellersProps = {
  sellers: SellerProfile[];
  categoryLabel: string;
};

export function CategoryPopularSellers({ sellers, categoryLabel }: CategoryPopularSellersProps) {
  if (sellers.length === 0) {
    return null;
  }

  return (
    <section className={`${ui.card} space-y-3 p-4`}>
      <div>
        <h2 className="text-[13px] font-bold text-wadeal-ink">이 카테고리의 인기 판매자</h2>
        <p className="mt-0.5 text-[11px] font-medium text-wadeal-muted">
          {categoryLabel}에서 많이 선택받은 판매자입니다.
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {sellers.map((seller) => (
          <li key={seller.id}>
            <Link
              className="celloh-transition flex flex-col items-center rounded-xl border border-wadeal-line bg-wadeal-surface/40 px-2 py-3 text-center hover:-translate-y-0.5 hover:shadow-card"
              href={getSellerSearchHref(seller)}
            >
              <SellerProfileAvatar name={seller.name} size="md" />
              <p className="mt-2 line-clamp-1 w-full text-[11px] font-black text-wadeal-ink">
                {seller.name}
              </p>
              {seller.isVerified ?
                <span className="mt-1">
                  <SellerVerifiedChip label={SELLER_UI_COPY.verifiedBadge} />
                </span>
              : null}
              <p className="mt-1.5 text-[10px] font-bold text-wadeal-muted">
                ★ {seller.rating.toFixed(1)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
