"use client";

import Link from "next/link";

import { MypageSocialLoginBlock } from "@/components/mypage/mypage-social-login-block";

type NotificationsGuestPreviewProps = {
  loginHref?: string;
};

/** 비로그인 알림 — 로그인 유도 (데모 알림·편집 UI 미노출) */
export function NotificationsGuestPreview({
  loginHref = "/login?next=%2Fnotifications",
}: NotificationsGuestPreviewProps) {
  return (
    <div className="space-y-6 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
      <section className="rounded-[24px] bg-[#F5F7F6] p-5">
        <h2 className="text-[20px] font-bold text-[#111111]">로그인이 필요해요</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">
          로그인하면 주문·배송·혜택 알림을 받을 수 있어요.
        </p>
        <Link
          className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-[#2E5E4E] text-[14px] font-semibold text-white active:opacity-90"
          href={loginHref}
        >
          로그인
        </Link>
      </section>

      <MypageSocialLoginBlock loginHref={loginHref} redirect="/notifications" />
    </div>
  );
}
