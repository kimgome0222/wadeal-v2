"use client";

import { useState } from "react";

import {
  INQUIRY_TYPE_OPTIONS,
  type MockInquiryType,
} from "@/lib/product/mock-product-inquiries";
import { ui } from "@/lib/ui";

type ProductInquiryMockFormProps = {
  productName: string;
};

export function ProductInquiryMockForm({ productName }: ProductInquiryMockFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState<MockInquiryType>("product");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!body.trim()) {
      setError("문의 내용을 입력해 주세요");
      return;
    }

    setSubmitted(true);
    setOpen(false);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-4 text-center" role="status">
        <p className="text-[14px] font-semibold text-[#111111]">문의가 접수되었습니다</p>
        <p className="mt-1 text-[12px] text-[#666666]">mock UI — 실제 DB 저장 없음</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!open ?
        <button
          aria-label="문의하기"
          className={`${ui.btnPrimary} flex h-12 w-full items-center justify-center rounded-2xl text-[15px] font-semibold`}
          onClick={() => setOpen(true)}
          type="button"
        >
          문의하기
        </button>
      : <form className="space-y-3 rounded-2xl border border-[#E8ECEA] bg-white p-4" onSubmit={handleSubmit}>
          <p className="text-[13px] font-semibold text-[#111111]">
            {productName} 문의 작성 (mock)
          </p>

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

          <input
            className={ui.input}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목 (선택)"
            value={title}
          />

          <textarea
            className={`${ui.input} min-h-24 resize-none`}
            onChange={(event) => setBody(event.target.value)}
            placeholder="문의 내용을 입력해 주세요"
            required
            value={body}
          />

          {error ?
            <p className="text-[12px] font-medium text-[#E28A3B]" role="alert">
              {error}
            </p>
          : null}

          <div className="grid grid-cols-2 gap-2">
            <button
              className={`${ui.btnOutline} h-11`}
              onClick={() => setOpen(false)}
              type="button"
            >
              취소
            </button>
            <button className={`${ui.btnPrimary} h-11`} type="submit">
              문의 등록
            </button>
          </div>
        </form>}
    </div>
  );
}
