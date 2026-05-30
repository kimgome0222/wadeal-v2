"use client";

import { useState } from "react";

import { ProductQASection } from "@/components/product-qa-section";

import type { ProductQuestionItem } from "@/lib/data/product-questions";

type InquiryTab = "product" | "seller";

type ProductInquirySectionProps = {
  productId: string;
  productName: string;
  questions: ProductQuestionItem[];
  isLoggedIn: boolean;
};

export function ProductInquirySection({
  productId,
  productName,
  questions,
  isLoggedIn,
}: ProductInquirySectionProps) {
  const [tab, setTab] = useState<InquiryTab>("product");

  return (
    <section className="scroll-mt-28 space-y-4 px-6 py-10" id="product-qna">
      <h2 className="text-[20px] font-bold text-[#111111]">문의</h2>

      <div className="flex gap-2">
        {(
          [
            { key: "product" as const, label: "상품문의" },
            { key: "seller" as const, label: "판매자문의" },
          ] as const
        ).map((item) => {
          const active = tab === item.key;
          return (
            <button
              aria-pressed={active}
              className={`h-11 cursor-pointer rounded-2xl px-4 text-[14px] font-semibold transition-colors ${
                active ?
                  "bg-[#2E5E4E] text-white"
                : "border border-[#E8ECEA] bg-white text-[#666666]"
              }`}
              key={item.key}
              onClick={() => setTab(item.key)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <ProductQASection
        compactEmpty
        isLoggedIn={isLoggedIn}
        productId={productId}
        productName={productName}
        questions={questions}
      />
    </section>
  );
}
