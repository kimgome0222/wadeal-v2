"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  hideSellerReviewReplyAction,
  saveSellerReviewReplyAction,
} from "@/app/actions/seller-reviews";
import { ui } from "@/lib/ui";

type SellerReviewReplyFormProps = {
  reviewId: string;
  initialBody?: string;
};

export function SellerReviewReplyForm({ reviewId, initialBody = "" }: SellerReviewReplyFormProps) {
  const router = useRouter();
  const [body, setBody] = useState(initialBody);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await saveSellerReviewReplyAction({ reviewId, body });
      setMessage(result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  function handleHide() {
    if (!confirm("답글을 삭제할까요?")) {
      return;
    }

    startTransition(async () => {
      const result = await hideSellerReviewReplyAction(reviewId);
      setMessage(result.message);
      if (result.success) {
        setBody("");
        router.refresh();
      }
    });
  }

  return (
    <div className={`${ui.panel} space-y-3`}>
      <p className="text-sm font-black text-wadeal-ink">판매자 답글</p>
      <textarea
        className={`${ui.input} min-h-28 resize-y`}
        disabled={isPending}
        onChange={(event) => setBody(event.target.value)}
        placeholder="고객 리뷰에 답글을 작성해 주세요."
        value={body}
      />
      {message ?
        <p className="text-xs font-bold text-wadeal-muted">{message}</p>
      : null}
      <div className="flex flex-wrap gap-2">
        <button
          className={`${ui.btnPrimary} h-10 px-4 text-xs`}
          disabled={isPending}
          onClick={handleSave}
          type="button"
        >
          {initialBody ? "답글 수정" : "답글 등록"}
        </button>
        {initialBody ?
          <button
            className={`${ui.btnOutline} h-10 px-4 text-xs`}
            disabled={isPending}
            onClick={handleHide}
            type="button"
          >
            답글 삭제
          </button>
        : null}
      </div>
    </div>
  );
}
