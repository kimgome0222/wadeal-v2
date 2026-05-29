"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { CoupangMenuSection } from "@/components/coupang-menu-list";
import { MypageLogoutButton } from "@/components/mypage-logout-button";
import {
  getVerificationStatusBadgeClass,
  getVerificationStatusLabel,
} from "@/lib/identity/verification-status";
import { resolveUserDisplayName } from "@/lib/auth/user-display";
import type { UserProfile } from "@/lib/profile/types";
import { ui } from "@/lib/ui";

type MypageAccountHubProps = {
  profile: UserProfile | null;
  user: User;
};

export function MypageAccountHub({ profile, user }: MypageAccountHubProps) {
  const displayName = resolveUserDisplayName({ profile, user });
  const avatarInitial = displayName.slice(0, 1) || "c";
  const verificationStatus = profile?.verificationStatus ?? "unverified";
  const identityLine =
    profile?.email && !profile.email.endsWith("@wadeal.local") ?
      profile.email
    : profile?.providerLabel ?
      `${profile.providerLabel} 로그인`
    : "연동 계정";

  const marketingMeta = profile?.marketingAgreedAt ? "동의" : "미동의";

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-wadeal-line bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-wadeal-surface text-xl font-bold text-wadeal-red">
            {avatarInitial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-wadeal-ink">{displayName}</p>
            <p className="mt-0.5 truncate text-xs font-medium text-wadeal-muted">{identityLine}</p>
            <p className="mt-1 text-[11px] font-medium text-wadeal-muted">
              {profile?.memberGrade ?? "일반"} 회원
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getVerificationStatusBadgeClass(verificationStatus)}`}
          >
            {getVerificationStatusLabel(verificationStatus)}
          </span>
        </div>
      </div>

      <CoupangMenuSection
        items={[
          { label: "회원정보 수정", href: "/mypage/profile/edit" },
          { label: "배송지 관리", href: "/mypage/addresses" },
          { label: "결제수단", href: "/mypage/payment" },
          { label: "로그인·보안", href: "/mypage/settings" },
          { label: "알림 설정", href: "/mypage/notification-settings" },
          {
            label: "마케팅 수신 동의",
            href: "/mypage/profile/edit#marketing",
            meta: marketingMeta,
          },
        ]}
        title="내 정보 관리"
      />

      <ul className={`overflow-hidden rounded-xl border border-wadeal-line bg-white ${ui.listDivider}`}>
        <li>
          <MypageLogoutButton />
        </li>
      </ul>
    </div>
  );
}
