"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { requestWithdrawalAction } from "@/app/actions/profile";
import type { UserProfile } from "@/lib/profile/types";
import { ui } from "@/lib/ui";

const withdrawalReasons = [
  "이용 빈도가 낮아요",
  "원하는 상품/딜이 없어요",
  "다른 서비스를 이용해요",
  "개인정보 보호 우려",
  "기타",
] as const;

type MypageWithdrawalContentProps = {
  profile: UserProfile;
  isSocialUser: boolean;
};

export function MypageWithdrawalContent({
  profile,
  isSocialUser,
}: MypageWithdrawalContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reason, setReason] = useState<(typeof withdrawalReasons)[number]>("기타");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [identityChecked, setIdentityChecked] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  const isWithdrawalRequested =
    profile.accountStatus === "withdrawal_requested" || profile.withdrawalRequestedAt != null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!confirmChecked || !identityChecked) {
      setFeedback({ tone: "error", message: "탈퇴 전 확인 항목을 모두 체크해 주세요." });
      return;
    }

    startTransition(async () => {
      const result = await requestWithdrawalAction();

      if (!result.success) {
        if (result.error === "not_allowed") {
          setFeedback({
            tone: "error",
            message: "진행 중인 주문/환불/정산이 있어 탈퇴할 수 없어요.",
          });
          return;
        }
        setFeedback({ tone: "error", message: "탈퇴 요청에 실패했어요." });
        return;
      }

      setFeedback({ tone: "success", message: "탈퇴 요청이 접수됐어요." });
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-wadeal-line bg-white p-4">
        <h1 className="text-base font-black text-wadeal-ink">Wadeal 서비스 탈퇴</h1>
        <p className="mt-2 text-xs font-bold leading-relaxed text-wadeal-muted">
          탈퇴 전 아래 내용을 꼭 확인해 주세요. 진행 중인 주문, 환불, 판매자 정산이 있으면 탈퇴가
          제한될 수 있어요.
        </p>
        <ul className="mt-3 space-y-1.5 text-[11px] font-bold text-wadeal-ink">
          <li>· 보유 쿠폰/포인트는 탈퇴 시 소멸됩니다.</li>
          <li>· 주문/결제/환불 기록은 법령에 따라 일정 기간 보관됩니다.</li>
          <li>· 마케팅 수신 정보는 탈퇴 즉시 비활성화됩니다.</li>
        </ul>
      </section>

      {isWithdrawalRequested ?
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
          탈퇴 요청이 접수된 상태예요.
        </p>
      : <form className="space-y-4" onSubmit={handleSubmit}>
          <section className="rounded-xl border border-wadeal-line bg-white p-4">
            <label className={ui.label} htmlFor="reason">
              탈퇴 사유
            </label>
            <select
              className={ui.input}
              id="reason"
              onChange={(event) =>
                setReason(event.target.value as (typeof withdrawalReasons)[number])
              }
              value={reason}
            >
              {withdrawalReasons.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </section>

          <section className="space-y-3 rounded-xl border border-wadeal-line bg-white p-4">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                checked={identityChecked}
                className="mt-0.5"
                onChange={(event) => setIdentityChecked(event.target.checked)}
                type="checkbox"
              />
              <span className="text-xs font-medium text-wadeal-muted">
                {isSocialUser ?
                  "본인 확인(소셜 로그인 계정)을 완료했습니다."
                : "비밀번호/휴대폰 본인 확인을 완료했습니다."}
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2">
              <input
                checked={confirmChecked}
                className="mt-0.5"
                onChange={(event) => setConfirmChecked(event.target.checked)}
                type="checkbox"
              />
              <span className="text-xs font-medium text-wadeal-muted">
                탈퇴 안내를 모두 확인했으며 Wadeal 서비스 탈퇴에 동의합니다.
              </span>
            </label>
          </section>

          {feedback ?
            <p
              className={`rounded-lg px-3 py-2 text-xs font-bold ${
                feedback.tone === "success" ?
                  "bg-green-50 text-green-700"
                : "bg-red-50 text-wadeal-red"
              }`}
            >
              {feedback.message}
            </p>
          : null}

          <button
            className={`${ui.btnPrimary} w-full cursor-pointer bg-red-600 hover:bg-red-700`}
            disabled={isPending}
            type="submit"
          >
            {isPending ? "처리 중..." : "탈퇴 신청"}
          </button>
        </form>
      }

      <Link
        className="block pt-6 text-center text-xs font-medium text-wadeal-muted underline underline-offset-2"
        href="/mypage/profile/edit"
      >
        회원정보 수정으로 돌아가기
      </Link>
    </div>
  );
}
