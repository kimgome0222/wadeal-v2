"use client";

import Link from "next/link";
import { useState } from "react";

import {
  MOCK_REFERRAL_ENTRIES,
  REFERRAL_BENEFIT_COPY,
  getReferralStatusLabel,
} from "@/lib/referral/mock-referral-status";
import { ui } from "@/lib/ui";

type ReferralInvitePanelProps = {
  inviteUrl?: string;
  referralCode?: string | null;
  showMockStatus?: boolean;
};

/** 친구추천 mock UI — DB/쿠폰 지급 연동 전 */
export function ReferralInvitePanel({
  inviteUrl = "",
  referralCode = "CELLOH-MOCK",
  showMockStatus = true,
}: ReferralInvitePanelProps) {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  async function handleCopyLink() {
    if (!inviteUrl) {
      setCopyMessage("초대 링크를 준비 중이에요.");
      return;
    }
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopyMessage("초대 링크가 복사됐어요.");
    } catch {
      setCopyMessage("링크 복사에 실패했어요.");
    }
  }

  function handleCopyCode() {
    if (!referralCode) {
      return;
    }
    void navigator.clipboard.writeText(referralCode);
    setCopyMessage("초대 코드가 복사됐어요.");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-3 text-[12px] leading-relaxed text-[#666666]">
        초대 혜택·지급 현황은 <strong>mock UI</strong>입니다. 실제 쿠폰 지급 전 법무·프로모션 검토 및
        DB(coupons/referrals) 설계가 필요합니다.
      </div>

      <section className="rounded-2xl border border-[#E8ECEA] bg-white p-4">
        <h2 className="text-[16px] font-bold text-[#111111]">내 초대 코드</h2>
        <p className="mt-2 rounded-xl bg-[#F5F7F6] px-4 py-3 text-center text-[20px] font-bold tracking-widest text-[#2E5E4E]">
          {referralCode ?? "준비 중"}
        </p>
        <button
          className={`${ui.btnOutline} mt-3 min-h-[44px] w-full`}
          onClick={handleCopyCode}
          type="button"
        >
          초대 코드 복사
        </button>
      </section>

      <section className="rounded-2xl border border-[#E8ECEA] bg-white p-4">
        <h2 className="text-[16px] font-bold text-[#111111]">초대 링크</h2>
        <p className="mt-2 break-all rounded-lg bg-[#FAFBFA] px-3 py-2.5 text-[12px] text-[#666666]">
          {inviteUrl || "로그인 후 초대 링크가 생성돼요."}
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <button
            className={`${ui.btnPrimary} min-h-[44px] w-full`}
            disabled={!inviteUrl}
            onClick={() => void handleCopyLink()}
            type="button"
          >
            초대 링크 복사
          </button>
          <button
            className={`${ui.btnOutline} min-h-[44px] w-full opacity-70`}
            disabled
            type="button"
          >
            카카오톡 공유 (준비 중)
          </button>
        </div>
        {copyMessage ?
          <p className="mt-2 text-center text-[12px] text-[#666666]">{copyMessage}</p>
        : null}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <article className="rounded-2xl border border-[#E8ECEA] bg-white p-4">
          <h3 className="text-[14px] font-bold text-[#111111]">친구에게 주는 혜택</h3>
          <p className="mt-2 text-[13px] text-[#666666]">가입 완료 시</p>
          <p className="mt-1 text-[15px] font-bold text-[#2E5E4E]">{REFERRAL_BENEFIT_COPY.friendSignup}</p>
        </article>
        <article className="rounded-2xl border border-[#E8ECEA] bg-white p-4">
          <h3 className="text-[14px] font-bold text-[#111111]">내가 받는 혜택</h3>
          <p className="mt-2 text-[13px] text-[#666666]">친구 첫 구매 완료 시</p>
          <p className="mt-1 text-[15px] font-bold text-[#2E5E4E]">
            {REFERRAL_BENEFIT_COPY.inviterFirstPurchase}
          </p>
        </article>
      </section>

      {showMockStatus ?
        <section className="rounded-2xl border border-[#E8ECEA] bg-white p-4">
          <h2 className="text-[16px] font-bold text-[#111111]">초대 현황 (mock)</h2>
          <ul className="mt-3 space-y-2">
            {MOCK_REFERRAL_ENTRIES.map((entry) => (
              <li
                className="flex items-center justify-between gap-2 rounded-xl bg-[#FAFBFA] px-3 py-2.5"
                key={entry.id}
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#111111]">{entry.friendLabel}</p>
                  <p className="text-[12px] text-[#666666]">{entry.rewardLabel}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-[#2E5E4E]">
                  {getReferralStatusLabel(entry.status)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      : null}

      <section className="rounded-2xl border border-[#E8ECEA] bg-white p-4">
        <h2 className="text-[14px] font-bold text-[#111111]">유의사항</h2>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-[#666666]">
          <li>{REFERRAL_BENEFIT_COPY.monthlyLimit}</li>
          <li>동일 기기·동일 결제수단·자가추천은 혜택 대상에서 제외될 수 있어요.</li>
          <li>주문 취소·환불 시 지급 예정 쿠폰이 회수될 수 있어요.</li>
        </ul>
        <Link className="mt-3 inline-block text-[13px] font-semibold text-[#2E5E4E]" href="/policies/referral">
          친구추천 정책 보기 →
        </Link>
      </section>
    </div>
  );
}
