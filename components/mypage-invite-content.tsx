"use client";

import { ReferralInvitePanel } from "@/components/referral/referral-invite-panel";
import { copyShareLink } from "@/lib/share/kakao";
import type { ShareStats } from "@/lib/share/types";
import { ui } from "@/lib/ui";
import { useState } from "react";

type MypageInviteContentProps = {
  referralCode: string | null;
  inviteUrl: string;
  stats: ShareStats;
};

export function MypageInviteContent({
  referralCode,
  inviteUrl,
  stats,
}: MypageInviteContentProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleCopy() {
    if (!inviteUrl) {
      setMessage("초대 링크를 준비할 수 없어요.");
      return;
    }

    const copied = await copyShareLink(inviteUrl);
    setMessage(copied ? "초대 링크가 복사됐어요." : "링크 복사에 실패했어요.");
  }

  return (
    <div className="space-y-4">
      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <h2 className="text-sm font-bold text-wadeal-ink">공유 통계</h2>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-wadeal-surface px-2 py-3">
            <dt className="text-[10px] font-bold text-wadeal-muted">공유</dt>
            <dd className="mt-1 text-lg font-black text-wadeal-ink">{stats.shareCount}</dd>
          </div>
          <div className="rounded-lg bg-wadeal-surface px-2 py-3">
            <dt className="text-[10px] font-bold text-wadeal-muted">방문</dt>
            <dd className="mt-1 text-lg font-black text-wadeal-ink">{stats.visitCount}</dd>
          </div>
          <div className="rounded-lg bg-wadeal-surface px-2 py-3">
            <dt className="text-[10px] font-bold text-wadeal-muted">전환</dt>
            <dd className="mt-1 text-lg font-black text-wadeal-ink">{stats.conversionCount}</dd>
          </div>
        </dl>
        {inviteUrl ?
          <button
            className={`${ui.btnPrimary} mt-3 h-11 w-full cursor-pointer`}
            onClick={() => void handleCopy()}
            type="button"
          >
            초대 링크 복사
          </button>
        : null}
        {message ?
          <p className="mt-2 text-center text-xs font-bold text-wadeal-muted">{message}</p>
        : null}
      </article>

      <ReferralInvitePanel inviteUrl={inviteUrl} referralCode={referralCode} />
    </div>
  );
}
