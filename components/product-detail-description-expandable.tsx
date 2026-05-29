"use client";

import { useState } from "react";

import type { Deal } from "@/lib/deals";
import { ui } from "@/lib/ui";

const defaultDescription =
  "celloh에서 판매자와 함께 준비한 상품입니다. 상세 컷과 핵심 정보를 확인하신 뒤 구매해 주세요.";

const PREVIEW_LENGTH = 120;

type ProductDetailDescriptionExpandableProps = {
  deal: Deal;
};

export function ProductDetailDescriptionExpandable({
  deal,
}: ProductDetailDescriptionExpandableProps) {
  const description = deal.description?.trim() || defaultDescription;
  const needsCollapse = description.length > PREVIEW_LENGTH;
  const [expanded, setExpanded] = useState(false);

  const visibleText =
    expanded || !needsCollapse ?
      description
    : `${description.slice(0, PREVIEW_LENGTH).trim()}…`;

  return (
    <section className={`${ui.card} space-y-3 p-4`} id="product-detail-description">
      <div>
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-[#2E5E4E]">
          상품 설명
        </h2>
      </div>

      <div className="rounded-xl bg-[#F5F8F4]/80 px-4 py-3.5">
        <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-wadeal-ink">
          {visibleText}
        </p>
      </div>

      {needsCollapse ?
        <button
          className="celloh-transition w-full cursor-pointer rounded-xl border border-[#DDE8E2] bg-white py-3 text-sm font-bold text-[#2E5E4E] hover:bg-[#F5F8F4]"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          {expanded ? "상품 설명 접기" : "상품 상세 더보기"}
        </button>
      : null}
    </section>
  );
}
