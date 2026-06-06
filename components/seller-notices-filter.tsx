"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  SELLER_NOTICE_CATEGORIES,
  getSellerNoticeCategoryLabel,
  type SellerNoticeCategory,
} from "@/lib/sellers/notice-types";
import { ui } from "@/lib/ui";

const FILTERS: { value: SellerNoticeCategory | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  ...SELLER_NOTICE_CATEGORIES.map((value) => ({
    value,
    label: getSellerNoticeCategoryLabel(value),
  })),
];

export function SellerNoticesFilter({ current }: { current: SellerNoticeCategory | "all" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filter.value === "all") {
          params.delete("category");
        } else {
          params.set("category", filter.value);
        }
        const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;

        return (
          <Link
            className={`rounded-full px-3 py-1.5 text-[11px] font-black ${
              current === filter.value ?
                "bg-wadeal-red text-white"
              : `${ui.btnOutline} h-auto border-wadeal-line text-wadeal-muted`
            }`}
            href={href}
            key={filter.value}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
