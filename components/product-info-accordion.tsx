"use client";

import { useState } from "react";

const infoSections = [
  {
    id: "shipping",
    title: "배송 정보",
    body: "공동구매 마감 후 2~3일 내 출고됩니다. 제주/도서 산간 지역은 추가 배송비가 발생할 수 있어요.",
  },
  {
    id: "refund",
    title: "교환/환불 안내",
    body: "상품 수령 후 7일 이내 미개봉 상태에서 교환·환불이 가능합니다. 공동구매 특성상 마감 후 단순 변심 환불은 제한될 수 있어요.",
  },
  {
    id: "group-buy",
    title: "공동구매 안내",
    body: "목표 인원 달성 시 최종 가격으로 자동 결제됩니다. 마감 전까지는 참여 취소가 가능해요.",
  },
];

export function ProductInfoAccordion() {
  const [openId, setOpenId] = useState<string | null>("shipping");

  return (
    <section className="rounded-xl border border-wadeal-line bg-white">
      <h2 className="border-b border-wadeal-line px-4 py-3 text-sm font-black text-wadeal-ink">
        상품 정보
      </h2>
      <div className="divide-y divide-wadeal-line">
        {infoSections.map((section) => {
          const isOpen = openId === section.id;

          return (
            <div key={section.id}>
              <button
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left active:bg-gray-50"
                onClick={() => setOpenId(isOpen ? null : section.id)}
                type="button"
              >
                <span className="text-sm font-black text-wadeal-ink">{section.title}</span>
                <span
                  aria-hidden
                  className={`text-wadeal-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>
              {isOpen ?
                <p className="px-4 pb-4 text-xs font-bold leading-relaxed text-wadeal-muted">
                  {section.body}
                </p>
              : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
