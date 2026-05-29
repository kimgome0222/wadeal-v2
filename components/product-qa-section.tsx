"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createProductQuestionFormAction } from "@/app/actions/product-questions";
import type { ProductQuestionItem } from "@/lib/data/product-questions";
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
        <p className="text-sm font-bold text-wadeal-muted">아직 등록된 문의가 없어요.</p>
      : <div className="space-y-3">
          {questions.map((question) => (
            <article className="rounded-xl border border-wadeal-line bg-white p-4" key={question.id}>
              <p className="text-[10px] font-bold text-wadeal-muted">{question.createdAtLabel}</p>
              <p className="mt-1 text-sm font-bold text-wadeal-ink">{question.content}</p>
              {question.adminReply ?
                <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
                  <p className="text-[10px] font-black text-wadeal-red">판매자 답변</p>
                  <p className="mt-1 text-xs font-bold text-wadeal-muted">{question.adminReply}</p>
                </div>
              : <p className="mt-2 text-xs font-bold text-wadeal-muted">답변 대기 중</p>}
            </article>
          ))}
        </div>
      }

      {isLoggedIn ?
        <form action={handleSubmit} className="space-y-2">
          <textarea
            className="min-h-24 w-full rounded-xl bg-gray-50 px-3 py-2 text-sm font-bold outline-none"
            name="content"
            placeholder="상품에 대해 궁금한 점을 남겨주세요."
            required
          />
          <button className={`${ui.btnPrimary} h-11 w-full disabled:opacity-50`} disabled={isPending} type="submit">
            {isPending ? "등록 중..." : "문의하기"}
          </button>
          {feedback ?
            <p className="text-xs font-bold text-wadeal-muted" role="status">
              {feedback}
            </p>
          : null}
        </form>
      : <p className="text-xs font-bold text-wadeal-muted">
          문의하려면{" "}
          <Link className="font-black text-wadeal-red underline" href={`/login?next=/product/${productId}`}>
            로그인
          </Link>
          이 필요해요.
        </p>
      }
    </div>
  );
}
