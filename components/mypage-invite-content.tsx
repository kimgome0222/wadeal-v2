"use client";

import { useState } from "react";

import { copyShareLink } from "@/lib/share/kakao";
import type { ShareStats } from "@/lib/share/types";
import { ui } from "@/lib/ui";

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
    <div className="space-y-3">
      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <h2 className={ui.sectionTitle}>친구 초대</h2>
        <p className="mt-2 text-xs font-bold leading-relaxed text-wadeal-muted">
          친구가 초대 링크로 Wadeal에 방문하면 공동구매를 더 빠르게 성공시킬 수 있어요.
        </p>

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
      </article>

      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <h3 className="text-sm font-black text-wadeal-ink">내 초대 코드</h3>
        <p className="mt-2 rounded-lg bg-wadeal-surface px-3 py-3 text-center text-lg font-black tracking-widest text-wadeal-red">
          {referralCode ?? "준비 중"}
        </p>
        <p className="mt-3 break-all rounded-lg bg-gray-50 px-3 py-2.5 text-[11px] font-bold text-wadeal-muted">
          {inviteUrl || "Supabase 연결 후 초대 링크가 생성돼요."}
        </p>
        <button
          className={`${ui.btnPrimary} mt-3 h-11 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
          disabled={!inviteUrl}
          onClick={() => void handleCopy()}
          type="button"
        >
          초대 링크 복사
        </button>
        {message ?
          <p className="mt-2 text-center text-xs font-bold text-wadeal-muted">{message}</p>
        : null}
      </article>
    </div>
  );
}
