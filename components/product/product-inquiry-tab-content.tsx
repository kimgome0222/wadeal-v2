"use client";

import Link from "next/link";
import { useState } from "react";

import { ProductInquiryMockForm } from "@/components/product/product-inquiry-mock-form";
import { ProductQASection } from "@/components/product-qa-section";
import type { ProductQuestionItem } from "@/lib/data/product-questions";
import {
  INQUIRY_POLICY_NOTES,
  INQUIRY_TYPE_OPTIONS,
  MOCK_PRODUCT_INQUIRIES,
  type MockInquiryType,
} from "@/lib/product/mock-product-inquiries";
import { ui } from "@/lib/ui";

type ProductInquiryTabContentProps = {
  productId: string;
  productName: string;
  questions: ProductQuestionItem[];
  isLoggedIn: boolean;
};

function MockInquiryCard({
  inquiry,
}: {
  inquiry: (typeof MOCK_PRODUCT_INQUIRIES)[number];
}) {
  return (
    <article className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-[#F5F7F6] px-2 py-0.5 text-[10px] font-bold text-[#666666]">
          {inquiry.typeLabel}
        </span>
        <span className="rounded bg-[#F5F7F6] px-2 py-0.5 text-[10px] font-bold text-[#666666]">
          {inquiry.isPublic ? "공개" : "비공개"}
        </span>
        <span
          className={`ml-auto text-[12px] font-semibold ${
            inquiry.status === "answered" ? "text-[#2E5E4E]" : "text-[#999999]"
          }`}
        >
          {inquiry.status === "answered" ? "답변완료" : "답변대기"}
        </span>
      </div>
      <h3 className="mt-2 text-[15px] font-semibold text-[#111111]">{inquiry.title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">{inquiry.content}</p>
      <p className="mt-2 text-[12px] text-[#999999]">{inquiry.createdAt}</p>
      {inquiry.sellerReply ?
        <div className="mt-3 rounded-2xl bg-[#F5F7F6] p-3">
          <p className="text-[12px] font-semibold text-[#666666]">판매자 답변 (mock)</p>
          <p className="mt-1 text-[14px] leading-relaxed text-[#111111]">{inquiry.sellerReply}</p>
        </div>
      : null}
    </article>
  );
}

export function ProductInquiryTabContent({
  productId,
  productName,
  questions,
  isLoggedIn,
}: ProductInquiryTabContentProps) {
  const [inquiryType, setInquiryType] = useState<MockInquiryType>("product");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const showMockSamples = questions.length === 0;

  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-[#F5F7F6] px-3 py-2.5 text-[11px] font-medium leading-relaxed text-[#666666]">
        문의 유형·공개 설정은 UI placeholder입니다. 실제 저장 정책은 상용화 시 확정됩니다.
      </p>

      <ProductInquiryMockForm productName={productName} />

      {showMockSamples ?
        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-[#666666]">샘플 문의 (mock)</p>
          {MOCK_PRODUCT_INQUIRIES.map((inquiry) => (
            <MockInquiryCard inquiry={inquiry} key={inquiry.id} />
          ))}
        </div>
      : null}

      <ProductQASection
        compactEmpty
        isLoggedIn={isLoggedIn}
        productId={productId}
        productName={productName}
        questions={questions}
      />

      {isLoggedIn ?
        <div className="space-y-3 rounded-2xl border border-dashed border-[#E8ECEA] bg-[#FAFBFA] p-4">
          <p className="text-[13px] font-semibold text-[#111111]">문의 옵션 (placeholder)</p>
          <div className="flex flex-wrap gap-2">
            {INQUIRY_TYPE_OPTIONS.map((opt) => (
              <button
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                  inquiryType === opt.id ?
                    "bg-[#2E5E4E] text-white"
                  : "border border-[#E8ECEA] bg-white text-[#666666]"
                }`}
                key={opt.id}
                onClick={() => setInquiryType(opt.id)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(
              [
                { key: "public" as const, label: "공개" },
                { key: "private" as const, label: "비공개" },
              ] as const
            ).map((item) => (
              <button
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                  visibility === item.key ?
                    "bg-[#2E5E4E] text-white"
                  : "border border-[#E8ECEA] bg-white text-[#666666]"
                }`}
                key={item.key}
                onClick={() => setVisibility(item.key)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#999999]">
            선택: {INQUIRY_TYPE_OPTIONS.find((o) => o.id === inquiryType)?.label} ·{" "}
            {visibility === "public" ? "공개" : "비공개"} — 실제 저장 없음
          </p>
        </div>
      : null}

      <div className="space-y-1 rounded-xl bg-[#F5F7F6] px-3 py-3">
        <p className="text-[12px] font-semibold text-[#666666]">문의·응답 기준</p>
        <ul className="space-y-1 text-[11px] leading-relaxed text-[#666666]">
          {INQUIRY_POLICY_NOTES.map((note) => (
            <li key={note}>· {note}</li>
          ))}
        </ul>
        <Link className="text-[11px] font-semibold text-[#2E5E4E] underline" href="/support/contact">
          1:1 문의
        </Link>
      </div>
    </div>
  );
}
