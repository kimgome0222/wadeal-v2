"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DealSnapshot } from "@/lib/storage/local-user-data";
import {
  getRecentDeals,
  LOCAL_DATA_EVENTS,
} from "@/lib/storage/local-user-data";
import { ui } from "@/lib/ui";

const currency = new Intl.NumberFormat("ko-KR");

export function RecentDealsSection() {
  const [items, setItems] = useState<DealSnapshot[]>([]);

  useEffect(() => {
    setItems(getRecentDeals());

    function syncRecent() {
      setItems(getRecentDeals());
    }

    window.addEventListener(LOCAL_DATA_EVENTS.recent, syncRecent);
    return () => {
      window.removeEventListener(LOCAL_DATA_EVENTS.recent, syncRecent);
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2" aria-label="최근 본 공동구매">
      <h2 className={ui.sectionTitle}>최근 본 공동구매</h2>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => (
          <Link
            className="w-[132px] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-wadeal-line bg-white shadow-card active:scale-[0.99]"
            href={`/product/${item.slug}`}
            key={item.slug}
          >
            <div className="relative aspect-square w-full bg-gray-50">
              <Image
                alt={item.productName}
                className="object-cover"
                fill
                loading="lazy"
                sizes="132px"
                src={item.imageUrl}
              />
            </div>
            <div className="space-y-1 p-2">
              <p className="line-clamp-2 min-h-[2rem] text-[11px] font-extrabold leading-snug text-wadeal-ink">
                {item.productName}
              </p>
              <p className="text-[13px] font-black text-wadeal-red">
                {currency.format(item.groupPrice)}원
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
