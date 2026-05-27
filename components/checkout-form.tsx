"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CheckoutFormProps = {
  dealSlug: string;
};

export function CheckoutForm({ dealSlug }: CheckoutFormProps) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-3">
      <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-center text-xs font-bold leading-relaxed text-amber-900">
        현재는 공동구매 참여 화면 체험용 프로토타입입니다.
      </p>
      <label className="panel flex cursor-pointer items-start gap-3 p-3.5">
        <input
          checked={agreed}
          className="mt-0.5 h-4 w-4 accent-wadeal-red"
          onChange={(event) => setAgreed(event.target.checked)}
          type="checkbox"
        />
        <span className="text-sm font-extrabold leading-5 text-wadeal-ink">
          최저가 달성 시 등록된 카드로 자동결제에 동의합니다.
        </span>
      </label>
      <button
        className="btn-primary"
        disabled={!agreed}
        onClick={() => router.push(`/join-complete?id=${dealSlug}`)}
        type="button"
      >
        공동구매 참여하기
      </button>
    </div>
  );
}
