"use client";

import { useState } from "react";
import { KakaoButton } from "@/components/kakao-button";
import { ui } from "@/lib/ui";

export function ShareCta() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <p className="text-base font-black text-wadeal-ink">
          친구 2명만 더 모이면 최저가!
        </p>
        <p className="text-sm font-extrabold text-wadeal-muted">
          같이 사고 더 싸게 구매해요
        </p>
      </div>
      {message ?
        <p className={ui.successBanner} role="status">
          {message}
        </p>
      : null}
      <KakaoButton
        onClick={() =>
          setMessage(
            "카카오톡 공유는 다음 개발 단계에서 실제 연결됩니다.",
          )
        }
      >
        카카오톡으로 공유하기
      </KakaoButton>
    </div>
  );
}
