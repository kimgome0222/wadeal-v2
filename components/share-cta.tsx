"use client";

import { useState } from "react";
import { KakaoButton } from "@/components/kakao-button";
import { ui } from "@/lib/ui";

export function ShareCta() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-black text-wadeal-ink">
        최저가까지 2명 남음
      </p>
      {message ?
        <p className={ui.successBanner} role="status">
          {message}
        </p>
      : null}
      <KakaoButton
        onClick={() =>
          setMessage("카카오톡 공유 기능은 다음 단계에서 연결됩니다.")
        }
      >
        카카오톡으로 공유하기
      </KakaoButton>
    </div>
  );
}
