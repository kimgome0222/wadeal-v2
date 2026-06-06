"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { getProductDetailHref } from "@/lib/deals/card-display";
import { buildCatalogIndex } from "@/lib/deals/catalog-validation";
import { currency } from "@/lib/deals";
import type { Deal } from "@/lib/deals";
import { LOCAL_DATA_EVENTS, getRecentDeals, type DealSnapshot } from "@/lib/storage/local-user-data";
import { ds } from "@/lib/design-system";

type ProductRecentlyViewedSectionProps = {
  excludeSlug?: string;
  maxItems?: number;
  catalog?: Deal[];
};

export function ProductRecentlyViewedSection({
  excludeSlug,
  maxItems = 4,
  catalog = [],
}: ProductRecentlyViewedSectionProps) {
  const [items, setItems] = useState<DealSnapshot[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const catalogIndex = useMemo(() => buildCatalogIndex(catalog), [catalog]);

  useEffect(() => {
    const sync = () => {
      setItems(
        getRecentDeals()
          .filter((item) => item.slug !== excludeSlug)
          .filter((item) => {
            if (catalog.length === 0) {
              return false;
            }
            return catalogIndex.slugs.has(item.slug);
          })
          .slice(0, maxItems),
      );
      setHydrated(true);
    };

    sync();
    window.addEventListener(LOCAL_DATA_EVENTS.recent, sync);
    return () => window.removeEventListener(LOCAL_DATA_EVENTS.recent, sync);
  }, [catalog.length, catalogIndex, excludeSlug, maxItems]);

  if (!hydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <section className={`${ds.card.padded} mt-6 space-y-3`} id="recently-viewed">
        <div>
          <h2 className={ds.type.h2}>최근 본 상품</h2>
          <p className={`mt-1 ${ds.type.caption}`}>
            둘러본 상품이 여기에 표시돼요.
          </p>
        </div>
        <p className={`rounded-[14px] border border-[#DDE8E2] bg-[#FAFBFA] px-3.5 py-3 text-center ${ds.type.meta}`}>
          아직 최근 본 상품이 없어요.
        </p>
      </section>
    );
  }

  return (
    <section className={`${ds.card.padded} mt-6 space-y-4`} id="recently-viewed">
      <div>
        <h2 className={ds.type.h2}>최근 본 상품</h2>
        <p className={`mt-1 ${ds.type.caption}`}>
          방금 전까지 둘러본 상품이에요.
        </p>
      </div>
      <div className="celloh-rail-scroll no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
        {items.map((item) => {
          const catalogDeal = catalogIndex.bySlug.get(item.slug);
          if (!catalogDeal) {
            return null;
          }

          return (
            <Link
              className="celloh-surface-card block w-[108px] shrink-0 overflow-hidden rounded-xl border border-wadeal-line bg-white"
              href={getProductDetailHref(catalogDeal)}
              key={item.slug}
            >
              <div className="relative aspect-square bg-gray-50">
                <Image
                  alt={item.productName}
                  className="object-cover"
                  fill
                  sizes="108px"
                  src={item.imageUrl}
                />
              </div>
              <div className="space-y-0.5 p-2">
                <p className={`line-clamp-2 ${ds.type.caption} text-wadeal-ink`}>
                  {catalogDeal.title}
                </p>
                <p className={ds.type.priceSm}>
                  {currency.format(item.groupPrice)}원
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <Link className={`${ds.type.link} block py-1 text-center`} href="/mypage/recent">
        최근 본 상품 더보기
      </Link>
    </section>
  );
}
