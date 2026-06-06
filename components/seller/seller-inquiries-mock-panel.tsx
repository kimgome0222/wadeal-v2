"use client";

import { useState } from "react";

import { MOCK_SELLER_INQUIRIES } from "@/lib/sellers/mock-seller-center-data";
import { ui } from "@/lib/ui";

const TYPE_LABEL = { product: "상품문의", shipping: "배송문의", return: "교환/반품" } as const;

export function SellerInquiriesMockPanel() {
  const [inquiries, setInquiries] = useState(MOCK_SELLER_INQUIRIES);
  const [answerDraft, setAnswerDraft] = useState<Record<string, string>>({});

  function submitAnswer(id: string) {
    if (!answerDraft[id]?.trim()) return;
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: "answered" as const } : inq)),
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-wadeal-muted">mock 문의 — 답변은 local state만</p>
      {inquiries.map((inquiry) => (
        <article className={`${ui.panel} space-y-2`} key={inquiry.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black">
              {TYPE_LABEL[inquiry.type]}
            </span>
            <span className="text-[10px] font-bold text-wadeal-muted">
              {inquiry.status === "pending" ? "답변대기" : "답변완료"}
            </span>
          </div>
          <p className="text-sm font-black text-wadeal-ink">{inquiry.title}</p>
          <p className="text-xs text-wadeal-muted">{inquiry.productName} · {inquiry.createdAt}</p>
          <p className="text-xs leading-relaxed text-wadeal-ink">{inquiry.content}</p>
          {inquiry.status === "pending" ?
            <div className="space-y-2">
              <textarea
                className={`${ui.input} min-h-16 text-xs`}
                onChange={(e) => setAnswerDraft((d) => ({ ...d, [inquiry.id]: e.target.value }))}
                placeholder="답변 작성 (mock)"
              />
              <button className={`${ui.btnPrimary} h-9 px-4 text-xs`} onClick={() => submitAnswer(inquiry.id)} type="button">
                답변 등록
              </button>
            </div>
          : null}
        </article>
      ))}
    </div>
  );
}
