"use client";

import { useState } from "react";

import type { CategorySlug } from "@/lib/categories";
import type { Deal } from "@/lib/deals";
import { ds } from "@/lib/design-system";

type ProductDetailHighlightsProps = {
  deal: Deal;
};

type CoreInfoItem = {
  label: string;
  value: string;
};

const CATEGORY_HINTS: Partial<Record<CategorySlug, Record<string, string>>> = {
  food: {
    소재: "국내산·수입산 원재료 (상품별 상이)",
    "사용 방법": "개봉 후 바로 드시거나 조리해 주세요.",
    "보관 방법": "직사광선을 피하고 서늘한 곳에 보관해 주세요.",
    주의사항: "유통기한 및 알레르기 유발 성분을 확인해 주세요.",
  },
  living: {
    소재: "상품 상세 이미지 및 판매자 안내 참고",
    "사용 방법": "용도에 맞게 사용해 주세요.",
    "보관 방법": "건조하고 통풍이 잘 되는 곳에 보관해 주세요.",
    주의사항: "화기·직사광선을 피해 주세요.",
  },
  beauty: {
    소재: "전성분은 상품 상세 이미지 참고",
    "사용 방법": "피부에 맞게 적당량을 사용해 주세요.",
    "보관 방법": "직사광선을 피하고 실온 보관해 주세요.",
    주의사항: "사용 중 이상이 있으면 사용을 중단해 주세요.",
  },
};

function buildCoreInfoItems(deal: Deal): CoreInfoItem[] {
  const tag =
    deal.categoryTags.find((slug) => CATEGORY_HINTS[slug] != null) ?? deal.categoryTags[0] ?? "living";
  const hints = CATEGORY_HINTS[tag] ?? CATEGORY_HINTS.living ?? {};

  const items: CoreInfoItem[] = [
    {
      label: "구성",
      value: deal.brandName?.trim() ?
        `${deal.brandName.trim()} · ${deal.title.trim()}`
      : deal.title.trim(),
    },
    { label: "소재", value: hints.소재 ?? "상품 상세 이미지 참고" },
    { label: "사이즈", value: "1개入 (옵션별 상이)" },
    {
      label: "사용 방법",
      value: hints["사용 방법"] ?? "상품 설명 및 상세 이미지를 확인해 주세요.",
    },
    {
      label: "보관 방법",
      value: hints["보관 방법"] ?? "배송 후 개봉 전까지 서늘한 곳에 보관해 주세요.",
    },
    {
      label: "주의사항",
      value: hints.주의사항 ?? "파손·변질 시 교환·환불 안내를 확인해 주세요.",
    },
  ];

  return items;
}

export function ProductDetailHighlights({ deal }: ProductDetailHighlightsProps) {
  const items = buildCoreInfoItems(deal);
  const description = deal.description?.trim();
  const [descOpen, setDescOpen] = useState(false);

  return (
    <section
      className="scroll-mt-28 space-y-3 rounded-xl border border-[#DDE8E2] bg-white p-4"
      id="product-detail-highlights"
    >
      <h2 className={`${ds.type.h2} font-semibold`}>상품 핵심 정보</h2>

      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            className="flex gap-3 rounded-lg bg-[#FAFBFA] px-3 py-2 text-[12px] leading-snug"
            key={item.label}
          >
            <span className="w-[4.5rem] shrink-0 font-medium text-wadeal-muted">
              {item.label}
            </span>
            <span className="min-w-0 flex-1 font-normal text-wadeal-ink">{item.value}</span>
          </li>
        ))}
      </ul>

      {description ?
        <>
          <button
            className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-[#DDE8E2] px-3 py-2 text-left transition-colors duration-200 hover:bg-[#FAFBFA]"
            onClick={() => setDescOpen((value) => !value)}
            type="button"
          >
            <span className={`${ds.type.bodySm} font-medium text-wadeal-ink`}>
              상세 설명 {descOpen ? "접기" : "보기"}
            </span>
            <span aria-hidden className={ds.type.caption}>{descOpen ? "▲" : "▼"}</span>
          </button>

          {descOpen ?
            <div className="rounded-lg bg-[#FAFBFA] px-3 py-2.5">
              <p className={`whitespace-pre-line ${ds.type.caption} leading-relaxed`}>
                {description}
              </p>
            </div>
          : null}
        </>
      : null}
    </section>
  );
}
