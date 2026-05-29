"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { changePasswordAction } from "@/app/actions/settings";
import { MypageLogoutButton } from "@/components/mypage-logout-button";
import type { UserProfile } from "@/lib/profile/types";
import { ui } from "@/lib/ui";

type MypageSettingsContentProps = {
  profile: UserProfile;
  isSocialUser: boolean;
  socialLoginMessage: string;
};

export function MypageSettingsContent({
  profile,
  isSocialUser,
  socialLoginMessage,
}: MypageSettingsContentProps) {
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startPasswordTransition(async () => {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        if (result.error === "invalid_current_password") {
          setFeedback({ tone: "error", message: "현재 비밀번호가 올바르지 않아요." });
          return;
        }
        if (result.error === "password_too_short") {
          setFeedback({ tone: "error", message: "새 비밀번호는 8자 이상이어야 해요." });
          return;
        }
        if (result.error === "password_mismatch") {
          setFeedback({ tone: "error", message: "새 비밀번호 확인이 일치하지 않아요." });
          return;
        }
        setFeedback({ tone: "error", message: "비밀번호 변경에 실패했어요." });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFeedback({ tone: "success", message: "비밀번호가 변경됐어요." });
    });
  }

  return (
    <div className="space-y-3">
      <section className={`${ui.card} p-4`}>
        <h2 className="text-sm font-black text-wadeal-ink">로그인 정보</h2>
        <dl className="mt-3 space-y-2 text-xs font-bold text-wadeal-muted">
          <div className="flex justify-between gap-3">
            <dt>로그인 방식</dt>
            <dd className="font-black text-wadeal-ink">{profile.providerLabel ?? "이메일"}</dd>
          </div>
          {profile.email ?
            <div className="flex justify-between gap-3">
              <dt>계정</dt>
              <dd className="break-all text-right font-black text-wadeal-ink">{profile.email}</dd>
            </div>
          : null}
        </dl>
        {isSocialUser ?
          <p className="mt-3 rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold text-wadeal-ink">
            {socialLoginMessage}
          </p>
        : null}
      </section>

      {isSocialUser ?
        <section className={`${ui.card} p-4`}>
          <h2 className="text-sm font-black text-wadeal-ink">비밀번호</h2>
          <p className="mt-2 text-xs font-bold leading-relaxed text-wadeal-muted">
            소셜 로그인 계정은 비밀번호 변경이 필요하지 않아요. 비밀번호 변경은 각 서비스(카카오
            등)에서 진행해 주세요.
          </p>
        </section>
      : <form
          className="space-y-4 rounded-xl border border-wadeal-line bg-white p-4"
          onSubmit={handlePasswordChange}
        >
          <h2 className="text-sm font-black text-wadeal-ink">비밀번호 변경</h2>
          <div>
            <label className={ui.label} htmlFor="currentPassword">
              현재 비밀번호
            </label>
            <input
              autoComplete="current-password"
              className={ui.input}
              id="currentPassword"
              onChange={(event) => setCurrentPassword(event.target.value)}
              type="password"
              value={currentPassword}
            />
          </div>
          <div>
            <label className={ui.label} htmlFor="newPassword">
              새 비밀번호
            </label>
            <input
              autoComplete="new-password"
              className={ui.input}
              id="newPassword"
              onChange={(event) => setNewPassword(event.target.value)}
              type="password"
              value={newPassword}
            />
          </div>
          <div>
            <label className={ui.label} htmlFor="confirmPassword">
              새 비밀번호 확인
            </label>
            <input
              autoComplete="new-password"
              className={ui.input}
              id="confirmPassword"
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              value={confirmPassword}
            />
          </div>
          <button
            className={`${ui.btnPrimary} w-full`}
            disabled={isPasswordPending}
            type="submit"
          >
            {isPasswordPending ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      }

      <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
        <li>
          <Link
            className="flex w-full items-center justify-between px-4 py-4 active:bg-gray-50"
            href="/mypage/notification-settings"
          >
            <span className="text-sm font-black text-wadeal-ink">알림 설정</span>
            <span aria-hidden className="text-gray-400">
              ›
            </span>
          </Link>
        </li>
        <li>
          <Link
            className="flex w-full items-center justify-between px-4 py-4 active:bg-gray-50"
            href="/mypage/profile/edit#marketing"
          >
            <span className="text-sm font-black text-wadeal-ink">마케팅 수신 동의</span>
            <span className="text-xs font-bold text-wadeal-muted">
              {profile.marketingAgreedAt ? "동의" : "미동의"}
            </span>
          </Link>
        </li>
        <li>
          <div className="flex w-full items-center justify-between px-4 py-4">
            <span className="text-sm font-black text-wadeal-ink">내 정보 다운로드</span>
            <span className="text-xs font-bold text-wadeal-muted">준비 중</span>
          </div>
        </li>
      </ul>

      <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
        <li>
          <MypageLogoutButton />
        </li>
      </ul>

      <p className="text-[11px] font-bold leading-relaxed text-wadeal-muted">
        계정 보안, 비밀번호 변경, 탈퇴는{" "}
        <Link className="text-wadeal-red underline underline-offset-2" href="/mypage/withdrawal">
          celloh 서비스 탈퇴
        </Link>
        {" "}페이지에서 확인할 수 있어요.
      </p>

      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ?
              "bg-green-50 text-green-700"
            : "bg-[#F5F8F4] text-wadeal-red"
          }`}
          role="status"
        >
          {feedback.message}
        </p>
      : null}
    </div>
  );
}
