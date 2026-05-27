"use client";

import { useState } from "react";
import { KakaoButton } from "@/components/kakao-button";
import { ui } from "@/lib/ui";

type ShareCtaProps = {
  remaining: number;
};

export function ShareCta({ remaining }: ShareCtaProps) {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-black text-wadeal-ink">
        최저가까지 {remaining}명 남음
      </p>
      <p className="text-center text-xs font-bold leading-relaxed text-wadeal-muted">
        친구를 초대하면 더 빨리 최저가에 도달해요.
      </p>
      {message ?
        <p className={ui.successBanner} role="status">
          {message}
        </p>
      : null}
      <KakaoButton
        onClick={() =>
          setMessage(
            "카카오톡 공유 미리보기: 같이 사면 더 싸져요! Wadeal 공동구매에 참여해보세요.",
          )
        }
      >
        카카오톡으로 공유하기
      </KakaoButton>
    </div>
  );
}
