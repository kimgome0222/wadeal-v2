"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createProductQuestionFormAction } from "@/app/actions/product-questions";
import { EmptyState } from "@/components/empty-state";
import { InquiryQuestionCard } from "@/components/inquiry/inquiry-question-card";
import type { ProductQuestionItem } from "@/lib/data/product-questions";
import { ui } from "@/lib/ui";

type ProductQASectionProps = {
  productId: string;
  productName: string;
  questions: ProductQuestionItem[];
  isLoggedIn: boolean;
  compactEmpty?: boolean;
};

export function ProductQASection({
  productId,
  productName,
  questions,
  isLoggedIn,
  compactEmpty = false,
}: ProductQASectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      await createProductQuestionFormAction(productId, productName, formData);
      setFeedback("문의가 등록됐어요.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {questions.length === 0 ?
        compactEmpty ?
          <p className="rounded-[20px] bg-[#F5F7F6] px-4 py-8 text-center text-[14px] text-[#666666]">
            아직 등록된 문의가 없어요. 궁금한 점을 남겨주세요.
          </p>
        : <EmptyState
            description="상품에 대해 궁금한 점을 남기면 판매자가 답변해 드려요."
            title="등록된 문의가 없어요"
          />
      : <div className="space-y-3">
          {questions.map((question) => (
            <InquiryQuestionCard key={question.id} question={question} />
          ))}
        </div>
      }

      {isLoggedIn ?
        <form action={handleSubmit} className="space-y-3">
          <label className="sr-only" htmlFor="product-question-content">
            문의 내용
          </label>
          <textarea
            className={`${ui.input} min-h-[120px] resize-none rounded-2xl py-3`}
            id="product-question-content"
            name="content"
            placeholder="상품에 대해 궁금한 점을 남겨주세요."
            required
          />
          <button
            aria-label="문의 등록"
            className={`${ui.btnPrimary} flex h-[52px] items-center justify-center rounded-2xl text-[15px] font-semibold disabled:opacity-50`}
            disabled={isPending}
            type="submit"
          >
            {isPending ? "등록 중..." : "문의하기"}
          </button>
          {feedback ?
            <p className="text-center text-[13px] text-[#2E5E4E]" role="status">
              {feedback}
            </p>
          : null}
        </form>
      : <p className="text-center text-[14px] text-[#666666]">
          문의하려면{" "}
          <Link
            className="font-semibold text-[#2E5E4E] underline underline-offset-2"
            href={`/login?next=/product/${productId}#product-qna`}
          >
            로그인
          </Link>
          이 필요해요.
        </p>
      }
    </div>
  );
}
