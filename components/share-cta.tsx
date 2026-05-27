"use client";

import { useState } from "react";
import { KakaoButton } from "@/components/kakao-button";

export function ShareCta() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-4">
      <p className="text-center text-lg font-black text-wadeal-ink">
        친구 2명만 더 모이면 최저가!
      </p>
      {message ?
        <p
          className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm font-extrabold text-wadeal-ink"
          role="status"
        >
          {message}
        </p>
      : null}
      <KakaoButton
        onClick={() =>
          setMessage("카카오톡 공유 기능은 다음 단계에서 실제 연결됩니다.")
        }
      >
        카카오톡으로 공유하기
      </KakaoButton>
    </div>
  );
}
