"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/lib/ui";

export function ShareActions() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  function handleKakaoShare() {
    setMessage("카카오톡 공유 기능은 곧 제공될 예정이에요.");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("링크가 복사됐어요.");
    } catch {
      setMessage("링크 복사에 실패했어요.");
    }
  }

  function handleViewOrders() {
    router.push("/mypage/orders");
  }

  return (
    <div className="space-y-2">
      {message ?
        <p className="rounded-xl bg-green-50 px-4 py-3 text-center text-xs font-bold text-green-700">
          {message}
        </p>
      : null}
      <button
        aria-label="카카오톡으로 공유하기"
        className={`${ui.btnKakao} w-full cursor-pointer`}
        onClick={handleKakaoShare}
        type="button"
      >
        카카오톡으로 공유하기
      </button>
      <button
        aria-label="링크 복사하기"
        className={`${ui.btnOutline} w-full cursor-pointer`}
        onClick={() => void handleCopyLink()}
        type="button"
      >
        링크 복사하기
      </button>
      <button
        aria-label="내 구매내역 보기"
        className={`${ui.btnOutline} w-full cursor-pointer`}
        onClick={handleViewOrders}
        type="button"
      >
        내 구매내역 보기
      </button>
    </div>
  );
}
