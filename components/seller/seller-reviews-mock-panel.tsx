"use client";

import { useState } from "react";

import { MOCK_SELLER_REVIEWS } from "@/lib/sellers/mock-seller-center-data";
import { ui } from "@/lib/ui";

export function SellerReviewsMockPanel() {
  const [reviews, setReviews] = useState(MOCK_SELLER_REVIEWS);
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  function submitReply(id: string) {
    if (!replyDraft[id]?.trim()) return;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, hasReply: true } : r)));
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-wadeal-muted">mock 리뷰 — 답글은 local state만</p>
      {reviews.map((review) => (
        <article className={`${ui.panel} space-y-2`} key={review.id}>
          <div className="flex justify-between gap-2">
            <p className="text-sm font-black text-wadeal-ink">{review.productName}</p>
            <span className="text-sm font-black text-wadeal-red">{review.rating}점</span>
          </div>
          <p className="text-xs font-bold text-wadeal-muted">{review.createdAt}</p>
          <p className="text-xs leading-relaxed text-wadeal-ink">{review.content}</p>
          {review.hasReply ?
            <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700">답글 완료 (mock)</p>
          : (
            <div className="space-y-2">
              <textarea
                className={`${ui.input} min-h-16 text-xs`}
                onChange={(e) => setReplyDraft((d) => ({ ...d, [review.id]: e.target.value }))}
                placeholder="답글 작성 (mock)"
                value={replyDraft[review.id] ?? ""}
              />
              <div className="flex gap-2">
                <button className={`${ui.btnPrimary} h-9 px-4 text-xs`} onClick={() => submitReply(review.id)} type="button">
                  답글 등록
                </button>
                <button className={`${ui.btnOutline} h-9 px-4 text-xs`} type="button">
                  신고 (mock)
                </button>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
