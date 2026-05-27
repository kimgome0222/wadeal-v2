"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitParticipationAction } from "@/app/actions/data";
import { PROTOTYPE_USER_ID } from "@/lib/database/types";

type CheckoutFormProps = {
  dealSlug: string;
};

export function CheckoutForm({ dealSlug }: CheckoutFormProps) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await submitParticipationAction({
        dealId: dealSlug,
        userId: PROTOTYPE_USER_ID,
      });
      router.push(`/join-complete?id=${encodeURIComponent(dealSlug)}`);
    });
  }

  return (
    <div className="space-y-3">
      <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-center text-xs font-bold leading-relaxed text-amber-900">
        현재 화면은 프로토타입이며 실제 결제는 진행되지 않습니다.
      </p>
      <label className="panel flex cursor-pointer items-start gap-3 p-3.5">
        <input
          checked={agreed}
          className="mt-0.5 h-4 w-4 accent-wadeal-red"
          onChange={(event) => setAgreed(event.target.checked)}
          type="checkbox"
        />
        <span className="text-sm font-extrabold leading-5 text-wadeal-ink">
          공동구매 마감 후 확정된 최종 가격으로 자동결제되는 것에 동의합니다.
        </span>
      </label>
      <button
        className="btn-primary"
        disabled={!agreed || isPending}
        onClick={handleConfirm}
        type="button"
      >
        {isPending ? "처리 중…" : "공동구매 참여 확정"}
      </button>
    </div>
  );
}
