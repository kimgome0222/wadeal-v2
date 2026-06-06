"use client";

import { useState } from "react";
import { logShareAction } from "@/app/actions/share";
import type { ShareMessageContent } from "@/lib/share/types";
import {
  canUseWebShare,
  copyShareLink,
  isKakaoShareEnabled,
  shareViaKakao,
  shareViaWebApi,
} from "@/lib/share/kakao";
import { ui, motion } from "@/lib/ui";

type ProductShareButtonProps = {
  productSlug: string;
  shareContent: ShareMessageContent;
  referralCode: string | null;
};

type FeedbackTone = "success" | "error";

export function ProductShareButton({
  productSlug,
  shareContent,
  referralCode,
}: ProductShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<FeedbackTone>("success");
  const [busy, setBusy] = useState(false);

  const kakaoEnabled = isKakaoShareEnabled();
  const webShareEnabled = canUseWebShare();

  function showFeedback(text: string, nextTone: FeedbackTone) {
    setMessage(text);
    setTone(nextTone);
  }

  async function recordShare(channel: "kakao" | "copy_link" | "web_share") {
    await logShareAction({
      productSlug,
      channel,
      referralCode,
    });
  }

  async function handleKakaoShare() {
    setBusy(true);
    try {
      const shared = await shareViaKakao({
        title: shareContent.title,
        description: shareContent.description,
        imageUrl: shareContent.imageUrl,
        linkUrl: shareContent.shareUrl,
      });

      if (!shared) {
        showFeedback("카카오 공유를 사용할 수 없어요. 링크 복사를 이용해 주세요.", "error");
        return;
      }

      await recordShare("kakao");
      showFeedback("카카오톡 공유 창을 열었어요.", "success");
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleCopyLink() {
    setBusy(true);
    try {
      const copied = await copyShareLink(shareContent.shareUrl);
      if (!copied) {
        showFeedback("링크 복사에 실패했어요.", "error");
        return;
      }

      await recordShare("copy_link");
      showFeedback("링크가 복사됐어요.", "success");
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleWebShare() {
    setBusy(true);
    try {
      const shared = await shareViaWebApi({
        title: shareContent.title,
        description: shareContent.description,
        imageUrl: shareContent.imageUrl,
        linkUrl: shareContent.shareUrl,
      });

      if (!shared) {
        showFeedback("공유를 완료하지 못했어요.", "error");
        return;
      }

      await recordShare("web_share");
      showFeedback("공유가 완료됐어요.", "success");
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        aria-label="공유하기"
        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white text-wadeal-muted active:bg-wadeal-surface"
        onClick={() => {
          setOpen(true);
          setMessage(null);
        }}
        type="button"
      >
        <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 20 20">
          <path
            d="M12.5 3.5 17 8l-4.5 4.5M17 8H8.5a4 4 0 0 0-4 4V13"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
          />
        </svg>
      </button>

      {open ?
        <div aria-modal="true" className={motion.drawerBackdrop} role="dialog">
          <button
            aria-label="닫기"
            className="absolute inset-0 cursor-pointer"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div
            className={`${motion.drawerPanel} px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-4`}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
            <p className="text-base font-black text-wadeal-ink">상품 공유하기</p>
            <p className="mt-1 text-xs font-bold text-wadeal-muted">
              좋은 판매자의 상품을 함께 발견해보세요.
            </p>

            {message ?
              <p
                className={`mt-3 rounded-xl px-4 py-3 text-center text-xs font-bold ${
                  tone === "success" ?
                    "bg-green-50 text-green-700"
                  : "bg-[#F5F8F4] text-wadeal-red"
                }`}
              >
                {message}
              </p>
            : null}

            <div className="mt-4 space-y-2">
              {kakaoEnabled ?
                <button
                  className={`${ui.btnKakao} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
                  disabled={busy}
                  onClick={() => void handleKakaoShare()}
                  type="button"
                >
                  카카오톡으로 공유하기
                </button>
              : null}
              <button
                className={`${ui.btnOutline} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
                disabled={busy}
                onClick={() => void handleCopyLink()}
                type="button"
              >
                링크 복사하기
              </button>
              {webShareEnabled ?
                <button
                  className={`${ui.btnOutline} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
                  disabled={busy}
                  onClick={() => void handleWebShare()}
                  type="button"
                >
                  다른 앱으로 공유하기
                </button>
              : null}
            </div>
          </div>
        </div>
      : null}
    </>
  );
}
