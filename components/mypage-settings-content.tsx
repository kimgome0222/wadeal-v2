"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { changePasswordAction } from "@/app/actions/settings";
import { CoupangMenuSection } from "@/components/coupang-menu-list";
import { MypageLogoutButton } from "@/components/mypage-logout-button";
import type { UserAddress } from "@/lib/addresses/types";
import type { UserProfile } from "@/lib/profile/types";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type MypageSettingsContentProps = {
  profile: UserProfile;
  isSocialUser: boolean;
  socialLoginMessage: string;
  defaultAddress?: UserAddress | null;
};

function SettingsInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <dt className={`${ds.type.caption} shrink-0 text-wadeal-muted`}>{label}</dt>
      <dd className={`${ds.type.bodySm} text-right font-medium text-wadeal-ink`}>{value}</dd>
    </div>
  );
}

function SettingsSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <section className={`${ui.card} p-4`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className={ds.type.label}>{title}</h2>
        {action ?
          <Link className={`${ds.type.link} text-[12px]`} href={action.href}>
            {action.label}
          </Link>
        : null}
      </div>
      {children}
    </section>
  );
}

export function MypageSettingsContent({
  profile,
  isSocialUser,
  socialLoginMessage,
  defaultAddress = null,
}: MypageSettingsContentProps) {
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  const displayName =
    profile.realName ?? profile.nickname ?? profile.email?.split("@")[0] ?? "회원";
  const customerName = profile.realName ?? profile.nickname ?? "미등록";
  const passwordLabel = isSocialUser ? "소셜 계정" : "••••••••";
  const addressLine =
    defaultAddress ?
      `${defaultAddress.addressLine1}${defaultAddress.addressLine2 ? ` ${defaultAddress.addressLine2}` : ""}`
    : "등록된 배송지가 없어요";

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
    <div className="space-y-4 pb-4">
      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        <div
          aria-hidden
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F8F4] text-[#2E5E4E]"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21a8 8 0 1 0-16 0" strokeLinecap="round" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1 className={ds.type.h2}>{displayName}님</h1>
        <Link className={`${ds.type.link} text-[13px]`} href="/mypage">
          마이셀로로 돌아가기
        </Link>
      </div>

      <SettingsSection
        action={{ label: "회원정보 수정", href: "/mypage/profile/edit" }}
        title="회원 정보"
      >
        <dl className="divide-y divide-[#EEF3F0]">
          <SettingsInfoRow label="고객명" value={customerName} />
          <SettingsInfoRow label="비밀번호" value={passwordLabel} />
          <SettingsInfoRow label="이메일" value={profile.email ?? "미등록"} />
          <SettingsInfoRow label="연락처" value={profile.phone ?? "미등록"} />
        </dl>
        {isSocialUser ?
          <p className="mt-3 rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-medium text-wadeal-ink">
            {socialLoginMessage}
          </p>
        : null}
      </SettingsSection>

      <SettingsSection
        action={{ label: "주소록 관리", href: "/mypage/addresses" }}
        title="수령인 정보"
      >
        <dl className="divide-y divide-[#EEF3F0]">
          <SettingsInfoRow
            label="수령인"
            value={defaultAddress?.recipientName ?? "미등록"}
          />
          <SettingsInfoRow label="주소" value={addressLine} />
          <SettingsInfoRow
            label="연락처"
            value={defaultAddress?.phone ?? profile.phone ?? "미등록"}
          />
        </dl>
      </SettingsSection>

      <CoupangMenuSection
        items={[
          { label: "멤버십", href: "/mypage/benefits" },
          { label: "멤버십 관리", href: "/mypage/benefits" },
        ]}
        title="멤버십"
      />

      {!isSocialUser ?
        <form
          className="space-y-4 rounded-xl border border-wadeal-line bg-white p-4"
          onSubmit={handlePasswordChange}
        >
          <h2 className={ds.type.label}>비밀번호 변경</h2>
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
      : null}

      <CoupangMenuSection
        items={[
          { label: "보안 및 로그인", href: "/mypage/account" },
          { label: "알림 설정", href: "/mypage/notification-settings" },
          { label: "국가/지역 및 언어", href: "/mypage/profile/edit", meta: "준비중" },
          { label: "회원 탈퇴", href: "/mypage/withdrawal" },
        ]}
        title="계정 설정"
      />

      <CoupangMenuSection
        items={[
          { label: "개인정보처리방침", href: "/privacy" },
          { label: "앱 버전", href: "/mypage/settings", meta: "1.0.0" },
          { label: "오픈소스", href: "/support", meta: "준비중" },
        ]}
        title="기타"
      />

      <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
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
          <MypageLogoutButton />
        </li>
      </ul>

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
