"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { changePasswordAction } from "@/app/actions/settings";
import { CoupangMenuSection } from "@/components/coupang-menu-list";
import { MypageLogoutButton } from "@/components/mypage-logout-button";
import type { UserAddress } from "@/lib/addresses/types";
import type { UserProfile } from "@/lib/profile/types";
import { ui } from "@/lib/ui";

type MypageSettingsContentProps = {
  profile: UserProfile;
  isSocialUser: boolean;
  socialLoginMessage: string;
  defaultAddress?: UserAddress | null;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#E8ECEA] py-4 last:border-b-0">
      <dt className="shrink-0 text-[14px] text-[#666666]">{label}</dt>
      <dd className="text-right text-[14px] font-medium text-[#111111]">{value}</dd>
    </div>
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
  const email = profile.email ?? "미등록";
  const phone = profile.phone ?? "미등록";
  const passwordLabel = isSocialUser ? socialLoginMessage : "••••••••";
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

      if (result.success) {
        setFeedback({ tone: "success", message: "비밀번호가 변경됐어요." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        return;
      }

      setFeedback({
        tone: "error",
        message:
          result.error === "invalid_current_password" ?
            "현재 비밀번호가 올바르지 않아요."
          : result.error === "password_mismatch" ?
            "새 비밀번호 확인이 일치하지 않아요."
          : "비밀번호 변경에 실패했어요.",
      });
    });
  }

  return (
    <div className="space-y-10 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
      <h1 className="text-[24px] font-bold text-[#111111]">내 정보 관리</h1>

      <div className="flex flex-col items-center gap-3 py-2">
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#2E5E4E] text-[24px] font-bold text-white">
          {displayName.slice(0, 1)}
        </span>
        <p className="text-[18px] font-bold text-[#111111]">{displayName}</p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#111111]">회원정보</h2>
          <Link className="text-[13px] font-medium text-[#666666]" href="/mypage/profile/edit">
            회원정보 수정
          </Link>
        </div>
        <dl className="rounded-[20px] border border-[#E8ECEA] bg-white px-4">
          <InfoRow label="이름" value={customerName} />
          <InfoRow label="이메일" value={email} />
          <InfoRow label="연락처" value={phone} />
          <InfoRow label="비밀번호" value={passwordLabel} />
        </dl>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#111111]">주소록</h2>
          <Link className="text-[13px] font-medium text-[#666666]" href="/mypage/addresses">
            주소록 관리
          </Link>
        </div>
        <dl className="rounded-[20px] border border-[#E8ECEA] bg-white px-4">
          <InfoRow label="수령인" value={defaultAddress?.recipientName ?? "미등록"} />
          <InfoRow label="주소" value={addressLine} />
          <InfoRow label="연락처" value={defaultAddress?.phone ?? "미등록"} />
        </dl>
      </section>

      <CoupangMenuSection
        items={[
          { label: "보안 및 로그인", href: "/mypage/security" },
          { label: "알림 설정", href: "/mypage/notification-settings" },
          { label: "국가/지역 및 언어", href: "/mypage/settings", meta: "한국어" },
          { label: "회원 탈퇴", href: "/mypage/withdrawal" },
        ]}
        title="계정 설정"
      />

      <CoupangMenuSection
        items={[
          { label: "개인정보처리방침", href: "/privacy" },
          { label: "앱 버전", href: "/mypage/settings", meta: "1.0.0" },
          { label: "오픈소스 라이선스", href: "/open-source" },
        ]}
        title="기타"
      />

      {!isSocialUser ?
        <form className="space-y-3 rounded-[20px] border border-[#E8ECEA] bg-white p-4" onSubmit={handlePasswordChange}>
          <h2 className="text-[16px] font-bold text-[#111111]">비밀번호 변경</h2>
          <input
            className={ui.input}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="현재 비밀번호"
            type="password"
            value={currentPassword}
          />
          <input
            className={ui.input}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="새 비밀번호"
            type="password"
            value={newPassword}
          />
          <input
            className={ui.input}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="새 비밀번호 확인"
            type="password"
            value={confirmPassword}
          />
          {feedback ?
            <p className={`text-[13px] ${feedback.tone === "success" ? "text-[#2E5E4E]" : "text-[#E28A3B]"}`}>
              {feedback.message}
            </p>
          : null}
          <button
            className={`${ui.btnPrimary} h-12 w-full rounded-2xl disabled:opacity-50`}
            disabled={isPasswordPending}
            type="submit"
          >
            {isPasswordPending ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      : null}

      <ul className="overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white">
        <li>
          <MypageLogoutButton />
        </li>
      </ul>
    </div>
  );
}
