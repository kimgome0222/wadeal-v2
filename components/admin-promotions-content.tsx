"use client";

import Link from "next/link";

import {
  MOCK_PROMOTION_STATUS_LABELS,
  type MockPromotionItem,
} from "@/lib/promotions/mock-promotion-data";
import { ui } from "@/lib/ui";

type AdminPromotionsContentProps = {
  promotions: MockPromotionItem[];
};

function statusClass(status: MockPromotionItem["status"]): string {
  switch (status) {
    case "live":
      return "bg-green-50 text-green-700";
    case "scheduled":
      return "bg-amber-50 text-amber-700";
    case "ended":
      return "bg-gray-100 text-gray-500";
    case "hidden":
      return "bg-gray-100 text-gray-400";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

/** Admin 프로모션 mock 목록 — DB 저장 없음 */
export function AdminPromotionsContent({ promotions }: AdminPromotionsContentProps) {
  if (promotions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-wadeal-line px-4 py-8 text-center text-xs font-bold text-wadeal-muted">
        등록된 프로모션이 없어요.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {promotions.map((promotion) => (
        <li
          className="rounded-xl border border-wadeal-line bg-white p-4"
          key={promotion.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black text-wadeal-muted">{promotion.id}</p>
              <h2 className="mt-1 text-base font-black text-wadeal-ink">{promotion.name}</h2>
              <p className="mt-2 text-xs font-bold text-wadeal-muted">
                {promotion.startsAt} – {promotion.endsAt}
              </p>
              <p className="mt-1 text-xs font-bold text-wadeal-muted">
                대상 상품 {promotion.productCount}개 · 쿠폰 {promotion.hasCoupon ? "포함" : "없음"}
              </p>
              <p className="mt-2 text-[11px] font-bold leading-relaxed text-wadeal-muted">
                노출: {promotion.placements.join(" · ")}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${statusClass(promotion.status)}`}
            >
              {MOCK_PROMOTION_STATUS_LABELS[promotion.status]}
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            {promotion.previewHref ?
              <Link
                className={`${ui.btnOutline} h-9 flex-1 text-xs`}
                href={promotion.previewHref}
                target="_blank"
              >
                미리보기
              </Link>
            : null}
            <button
              className={`${ui.btnOutline} h-9 flex-1 text-xs opacity-60`}
              disabled
              type="button"
            >
              수정 (mock)
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
