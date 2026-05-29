"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { getProductDetailHref } from "@/lib/deals/card-display";
import { currency } from "@/lib/deals";
import { LOCAL_DATA_EVENTS, getRecentDeals, type DealSnapshot } from "@/lib/storage/local-user-data";
import { ds } from "@/lib/design-system";

type ProductRecentlyViewedSectionProps = {
  excludeSlug?: string;
  maxItems?: number;
};

export function ProductRecentlyViewedSection({
  excludeSlug,
  maxItems = 6,
}: ProductRecentlyViewedSectionProps) {
  const [items, setItems] = useState<DealSnapshot[]>([]);

  useEffect(() => {
    const sync = () => {
      setItems(
        getRecentDeals()
          .filter((item) => item.slug !== excludeSlug)
          .slice(0, maxItems),
      );
    };

    sync();
    window.addEventListener(LOCAL_DATA_EVENTS.recent, sync);
    return () => window.removeEventListener(LOCAL_DATA_EVENTS.recent, sync);
  }, [excludeSlug, maxItems]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={`${ds.card.padded} space-y-4`} id="recently-viewed">
      <div>
        <h2 className={ds.type.h2}>최근 본 상품</h2>
        <p className={`mt-1.5 ${ds.type.caption}`}>
          방금 전까지 둘러본 상품이에요.
        </p>
      </div>
      <div className="celloh-rail-scroll no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
        {items.map((item) => (
          <Link
            className="celloh-surface-card block w-[108px] shrink-0 overflow-hidden rounded-xl border border-wadeal-line bg-white"
            href={getProductDetailHref({ id: 0, slug: item.slug })}
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
                {item.productName}
              </p>
              <p className={ds.type.priceSm}>
                {currency.format(item.groupPrice)}원
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
