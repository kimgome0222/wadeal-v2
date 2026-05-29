"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { replySellerProductInquiryAction } from "@/app/actions/seller-product-inquiries";
import type { SellerProductInquiryItem } from "@/lib/data/seller-product-inquiries";
import { ui } from "@/lib/ui";

type SellerProductInquiryReplyFormProps = {
  inquiryId: string;
};

export function SellerProductInquiryReplyForm({ inquiryId }: SellerProductInquiryReplyFormProps) {
  const router = useRouter();
  const [reply, setReply] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await replySellerProductInquiryAction(inquiryId, reply);
      setFeedback(result.message);
      if (result.ok) {
        setReply("");
        router.refresh();
      }
    });
  }

  return (
    <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
      <textarea
        className={`${ui.input} min-h-20 w-full resize-y text-xs`}
        onChange={(event) => setReply(event.target.value)}
        placeholder="고객에게 보낼 답변을 입력해 주세요."
        value={reply}
      />
      {feedback ?
        <p className="text-[11px] font-bold text-wadeal-muted">{feedback}</p>
      : null}
      <button
        className={`${ui.btnPrimary} h-9 px-4 text-xs disabled:opacity-50`}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "저장 중..." : "답변 등록"}
      </button>
    </form>
  );
}

type SellerProductInquiriesListProps = {
  inquiries: SellerProductInquiryItem[];
};

export function SellerProductInquiriesList({ inquiries }: SellerProductInquiriesListProps) {
  if (inquiries.length === 0) {
    return (
      <div className={`${ui.panel} py-10 text-center`}>
        <p className="text-sm font-bold text-wadeal-muted">표시할 상품 문의가 없어요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inquiry) => (
        <article className={`${ui.panel} space-y-2`} key={inquiry.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-wadeal-ink">{inquiry.productName}</p>
              <p className="mt-1 text-[11px] font-bold text-wadeal-muted">{inquiry.createdAtLabel}</p>
            </div>
            <span className="rounded-full bg-wadeal-surface px-2 py-0.5 text-[10px] font-black text-wadeal-muted">
              {inquiry.adminReply ? "답변 완료" : "답변 대기"}
            </span>
          </div>
          <p className="text-xs font-bold leading-relaxed text-wadeal-ink">{inquiry.content}</p>
          {inquiry.adminReply ?
            <div className="rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold text-wadeal-muted">
              <span className="font-black text-wadeal-ink">판매자 답변</span>
              <p className="mt-1 whitespace-pre-wrap">{inquiry.adminReply}</p>
            </div>
          : <SellerProductInquiryReplyForm inquiryId={inquiry.id} />
          }
        </article>
      ))}
    </div>
  );
}
