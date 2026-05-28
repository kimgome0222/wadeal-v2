"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { SellerReviewFilter } from "@/lib/data/seller-reviews";
import { ui } from "@/lib/ui";

const FILTERS: { value: SellerReviewFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "rating5", label: "5점" },
  { value: "rating4", label: "4점" },
  { value: "rating3_or_below", label: "3점 이하" },
  { value: "no_reply", label: "답글 없음" },
  { value: "has_reply", label: "답글 완료" },
  { value: "reported", label: "신고됨" },
];

export function SellerReviewsFilter({ current }: { current: SellerReviewFilter }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filter.value === "all") {
          params.delete("filter");
        } else {
          params.set("filter", filter.value);
        }
        const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        const active = current === filter.value;

        return (
          <Link
            className={`rounded-full px-3 py-1.5 text-[11px] font-black ${
              active ?
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
