"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-3">
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
        onClick={() => router.push("/join-complete")}
        type="button"
      >
        공동구매 참여하기
      </button>
    </div>
  );
}
