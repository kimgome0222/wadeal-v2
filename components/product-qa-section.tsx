"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createProductQuestionFormAction } from "@/app/actions/product-questions";
import { EmptyState } from "@/components/empty-state";
import type { ProductQuestionItem } from "@/lib/data/product-questions";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type ProductQASectionProps = {
  productId: string;
  productName: string;
  questions: ProductQuestionItem[];
  isLoggedIn: boolean;
};

export function ProductQASection({
  productId,
  productName,
  questions,
  isLoggedIn,
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
        <EmptyState
          description="상품에 대해 궁금한 점을 남겨주시면 판매자가 답변해 드려요."
          title="아직 등록된 문의가 없어요."
          variant="default"
        />
      : <div className="space-y-3">
          {questions.map((question) => (
            <article className={ds.card.padded} key={question.id}>
              <p className={ds.type.meta}>{question.createdAtLabel}</p>
              <p className={`mt-1 ${ds.type.body}`}>{question.content}</p>
              {question.adminReply ?
                <div className="mt-3 rounded-lg border border-[#DDE8E2] bg-[#FAFBFA] px-3 py-2.5">
                  <p className={`${ds.type.label} text-wadeal-red`}>판매자 답변</p>
                  <p className={`mt-1 ${ds.type.bodySm}`}>{question.adminReply}</p>
                </div>
              : <p className={`mt-2 ${ds.type.caption}`}>답변 대기 중</p>}
            </article>
          ))}
        </div>
      }

      {isLoggedIn ?
        <form action={handleSubmit} className="space-y-2.5">
          <label className="sr-only" htmlFor="product-question-content">
            문의 내용
          </label>
          <textarea
            className={`${ui.input} min-h-[96px] resize-none py-3`}
            id="product-question-content"
            name="content"
            placeholder="상품에 대해 궁금한 점을 남겨주세요."
            required
          />
          <button
            aria-label="문의 등록"
            className={`${ui.btnPrimary} min-h-[44px] disabled:opacity-50`}
            disabled={isPending}
            type="submit"
          >
            {isPending ? "등록 중..." : "문의하기"}
          </button>
          {feedback ?
            <p className={ds.type.caption} role="status">
              {feedback}
            </p>
          : null}
        </form>
      : <p className={ds.type.bodySm}>
          문의하려면{" "}
          <Link
            className="font-medium text-wadeal-red underline underline-offset-2"
            href={`/login?next=/product/${productId}`}
          >
            로그인
          </Link>
          이 필요해요.
        </p>
      }
    </div>
  );
}
