"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  sendPhoneVerificationCodeAction,
  updateFullProfileAction,
  verifyPhoneCodeAction,
} from "@/app/actions/profile";
import {
  isUuidLike,
  resolveUserDisplayName,
} from "@/lib/auth/user-display";
import type { User } from "@supabase/supabase-js";
import {
  getVerificationStatusBadgeClass,
  getVerificationStatusLabel,
} from "@/lib/identity/verification-status";
import { formatKoreanMobile, normalizePhone } from "@/lib/identity/phone";
import type { UserGender, UserProfile } from "@/lib/profile/types";
import { ui } from "@/lib/ui";

type MypageProfileContentProps = {
  initialProfile: UserProfile | null;
  returnPath?: string | null;
  user?: User | null;
};

function initialNicknameValue(profile: UserProfile | null, user?: User | null): string {
  if (profile?.nickname && !isUuidLike(profile.nickname)) {
    return profile.nickname;
  }

  if (user) {
    const fromAuth = resolveUserDisplayName({ user, profile });
    if (fromAuth !== "회원" && !isUuidLike(fromAuth)) {
      return fromAuth;
    }
  }

  return "";
}

const GENDER_OPTIONS: { value: UserGender; label: string }[] = [
  { value: null, label: "선택 안 함" },
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "other", label: "기타" },
];

const QUICK_MENU_ITEMS = [
  { label: "배송지 관리", href: "/mypage/addresses" },
  { label: "결제수단", href: "/mypage/payment" },
  { label: "로그인·보안 설정", href: "/mypage/settings" },
  { label: "알림 설정", href: "/mypage/notification-settings" },
];

function getInitialNickname(profile: UserProfile | null, user?: User | null): string {
  return initialNicknameValue(profile, user);
}

export function MypageProfileContent({
  initialProfile,
  returnPath = null,
  user = null,
}: MypageProfileContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSendingCode, startSendCodeTransition] = useTransition();
  const [isVerifyingCode, startVerifyCodeTransition] = useTransition();
  const [profile, setProfile] = useState(initialProfile);
  const [realName, setRealName] = useState(initialProfile?.realName ?? "");
  const [nickname, setNickname] = useState(() => getInitialNickname(initialProfile, user));
  const [phone, setPhone] = useState(initialProfile?.phone ?? "");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [phoneVerifiedLocally, setPhoneVerifiedLocally] = useState(
    Boolean(initialProfile?.phoneVerifiedAt),
  );
  const [birthDate, setBirthDate] = useState(initialProfile?.birthDate ?? "");
  const [gender, setGender] = useState<UserGender>(initialProfile?.gender ?? null);
  const [marketing, setMarketing] = useState(Boolean(initialProfile?.marketingAgreedAt));
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  const verificationStatus = profile?.verificationStatus ?? "unverified";
  const savedPhoneNormalized = normalizePhone(initialProfile?.phone ?? "");
  const currentPhoneNormalized = normalizePhone(phone);
  const phoneChanged = currentPhoneNormalized !== savedPhoneNormalized;
  const needsPhoneVerification =
    Boolean(currentPhoneNormalized) &&
    (phoneChanged || !initialProfile?.phoneVerifiedAt) &&
    !phoneVerifiedLocally;

  function handlePhoneChange(value: string) {
    setPhone(value);
    setVerificationCode("");
    setCodeSent(false);
    setPhoneVerifiedLocally(false);
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (needsPhoneVerification) {
      setFeedback({
        tone: "error",
        message: "휴대폰 번호 변경 후 인증을 완료해 주세요.",
      });
      return;
    }

    startTransition(async () => {
      const result = await updateFullProfileAction({
        realName,
        phone,
        nickname,
        birthDate: birthDate || null,
        gender,
        marketing,
      });

      if (!result.success) {
        if (result.error === "invalid_name") {
          setFeedback({ tone: "error", message: "이름을 입력해 주세요." });
          return;
        }
        if (result.error === "invalid_phone") {
          setFeedback({
            tone: "error",
            message: "010으로 시작하는 휴대폰 번호를 입력해 주세요.",
          });
          return;
        }
        if (result.error === "invalid_nickname") {
          setFeedback({ tone: "error", message: "닉네임은 2자 이상 입력해 주세요." });
          return;
        }
        if (result.error === "withdrawal_pending") {
          setFeedback({ tone: "error", message: "탈퇴 요청 중에는 정보를 수정할 수 없어요." });
          return;
        }
        setFeedback({ tone: "error", message: "저장에 실패했어요. 다시 시도해 주세요." });
        return;
      }

      setProfile((prev) =>
        prev ?
          {
            ...prev,
            realName: realName.trim(),
            nickname: nickname.trim() || prev.nickname,
            phone: formatKoreanMobile(phone),
            birthDate: birthDate || null,
            gender,
            marketingAgreedAt: marketing ? new Date().toISOString() : null,
            phoneVerifiedAt:
              phoneVerifiedLocally || !phoneChanged ? prev.phoneVerifiedAt : null,
            verificationStatus:
              phoneVerifiedLocally || !phoneChanged ? prev.verificationStatus : "unverified",
          }
        : prev,
      );
      setFeedback({ tone: "success", message: "프로필이 저장됐어요." });
      router.refresh();
    });
  }

  function handleSendVerificationCode() {
    setFeedback(null);

    startSendCodeTransition(async () => {
      const result = await sendPhoneVerificationCodeAction(phone);

      if (!result.success) {
        if (result.error === "invalid_phone") {
          setFeedback({
            tone: "error",
            message: "010으로 시작하는 휴대폰 번호를 입력해 주세요.",
          });
          return;
        }
        setFeedback({ tone: "error", message: "인증번호 발송에 실패했어요." });
        return;
      }

      setCodeSent(true);
      setFeedback({
        tone: "success",
        message:
          result.devCode ?
            `인증번호를 발송했어요. (개발용: ${result.devCode})`
          : "인증번호를 발송했어요.",
      });
    });
  }

  function handleVerifyCode() {
    setFeedback(null);

    startVerifyCodeTransition(async () => {
      const result = await verifyPhoneCodeAction({ phone, code: verificationCode });

      if (!result.success) {
        if (result.error === "invalid_phone") {
          setFeedback({
            tone: "error",
            message: "010으로 시작하는 휴대폰 번호를 입력해 주세요.",
          });
          return;
        }
        if (result.error === "code_missing") {
          setFeedback({ tone: "error", message: "인증번호를 먼저 발송해 주세요." });
          return;
        }
        if (result.error === "code_expired") {
          setFeedback({ tone: "error", message: "인증번호가 만료됐어요. 다시 발송해 주세요." });
          return;
        }
        if (result.error === "code_mismatch") {
          setFeedback({ tone: "error", message: "인증번호가 올바르지 않아요." });
          return;
        }
        setFeedback({ tone: "error", message: "인증에 실패했어요. 다시 시도해 주세요." });
        return;
      }

      setPhoneVerifiedLocally(true);
      setProfile((prev) =>
        prev ?
          {
            ...prev,
            phone: formatKoreanMobile(phone),
            phoneVerifiedAt: new Date().toISOString(),
            verificationStatus: "phone_verified",
          }
        : prev,
      );
      setFeedback({ tone: "success", message: "휴대폰 인증이 완료됐어요." });
      router.refresh();
    });
  }

  const memberIdSuffix = profile?.userId ? profile.userId.slice(-8).toUpperCase() : "—";
  const displayName = resolveUserDisplayName({ profile, user });
  const avatarInitial = displayName.slice(0, 1) || "W";

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-wadeal-line bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wadeal-surface text-lg font-bold text-wadeal-red">
            {avatarInitial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-wadeal-ink">{displayName}</p>
            <p className="truncate text-xs font-bold text-wadeal-muted">
              {profile?.email ?? "이메일 미등록"}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getVerificationStatusBadgeClass(verificationStatus)}`}
          >
            {getVerificationStatusLabel(verificationStatus)}
          </span>
        </div>
      </div>

      <ul className={`overflow-hidden rounded-xl border border-wadeal-line bg-white ${ui.listDivider}`}>
        {QUICK_MENU_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              className="flex w-full cursor-pointer items-center justify-between px-4 py-4 transition-colors duration-150 active:bg-gray-50"
              href={item.href}
            >
              <span className="text-sm font-semibold text-wadeal-ink">{item.label}</span>
              <span aria-hidden className="text-gray-400">
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <form className="space-y-3" onSubmit={handleSave}>
        <section className="overflow-hidden rounded-xl border border-wadeal-line bg-white">
          <h2 className="border-b border-wadeal-line bg-wadeal-surface px-4 py-2.5 text-xs font-bold text-wadeal-muted">
            계정 정보
          </h2>
          <div className="space-y-4 p-4">
            <div>
              <label className={ui.label} htmlFor="loginEmail">
                로그인 계정
              </label>
              <input
                className={`${ui.input} cursor-default bg-wadeal-surface text-wadeal-muted`}
                id="loginEmail"
                readOnly
                value={profile?.email ?? "이메일 미등록"}
              />
              {profile?.providerLabel ?
                <p className="mt-1.5 text-[11px] font-medium text-wadeal-muted">
                  {profile.providerLabel} 연동
                </p>
              : null}
            </div>

            <dl className={`overflow-hidden rounded-lg border border-wadeal-line ${ui.listDivider} text-sm`}>
              <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                <dt className="shrink-0 text-xs font-medium text-wadeal-muted">회원 등급</dt>
                <dd className="font-semibold text-wadeal-ink">{profile?.memberGrade ?? "일반"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                <dt className="shrink-0 text-xs font-medium text-wadeal-muted">회원번호</dt>
                <dd className="font-mono text-xs font-semibold text-wadeal-ink">{memberIdSuffix}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-wadeal-line bg-white">
          <h2 className="border-b border-wadeal-line bg-wadeal-surface px-4 py-2.5 text-xs font-bold text-wadeal-muted">
            필수 정보
          </h2>
          <div className="space-y-4 p-4">
            <div>
              <label className={ui.label} htmlFor="realName">
                이름 <span className="text-wadeal-red">*</span>
              </label>
              <input
                className={ui.input}
                id="realName"
                name="realName"
                onChange={(event) => setRealName(event.target.value)}
                placeholder="실명"
                required
                value={realName}
              />
            </div>

            <div>
              <label className={ui.label} htmlFor="nickname">
                닉네임
              </label>
              <input
                className={ui.input}
                id="nickname"
                name="nickname"
                onChange={(event) => setNickname(event.target.value)}
                placeholder="닉네임 (2자 이상)"
                value={nickname}
              />
            </div>

            <div>
              <label className={ui.label} htmlFor="phone">
                휴대폰 번호 <span className="text-wadeal-red">*</span>
              </label>
              <input
                className={ui.input}
                id="phone"
                inputMode="numeric"
                name="phone"
                onChange={(event) => handlePhoneChange(event.target.value)}
                placeholder="010-0000-0000"
                required
                value={phone}
              />
              {needsPhoneVerification ?
                <div className="mt-2 space-y-2">
                  <button
                    className={`${ui.btnOutline} w-full cursor-pointer`}
                    disabled={isSendingCode}
                    onClick={handleSendVerificationCode}
                    type="button"
                  >
                    {isSendingCode ? "발송 중..." : "인증번호 발송"}
                  </button>

                  {codeSent ?
                    <div className="space-y-2">
                      <input
                        className={ui.input}
                        inputMode="numeric"
                        onChange={(event) => setVerificationCode(event.target.value)}
                        placeholder="인증번호 6자리"
                        value={verificationCode}
                      />
                      <button
                        className={`${ui.btnPrimary} w-full cursor-pointer`}
                        disabled={isVerifyingCode}
                        onClick={handleVerifyCode}
                        type="button"
                      >
                        {isVerifyingCode ? "확인 중..." : "인증 확인"}
                      </button>
                    </div>
                  : null}
                </div>
              : phoneVerifiedLocally || profile?.phoneVerifiedAt ?
                <p className="mt-2 text-[11px] font-semibold text-green-700">휴대폰 인증 완료</p>
              : null}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-wadeal-line bg-white">
          <h2 className="border-b border-wadeal-line bg-wadeal-surface px-4 py-2.5 text-xs font-bold text-wadeal-muted">
            추가 정보 (선택)
          </h2>
          <div className="space-y-4 p-4">
            <div>
              <label className={ui.label} htmlFor="birthDate">
                생년월일
              </label>
              <input
                className={ui.input}
                id="birthDate"
                name="birthDate"
                onChange={(event) => setBirthDate(event.target.value)}
                type="date"
                value={birthDate ?? ""}
              />
            </div>

            <div>
              <label className={ui.label} htmlFor="gender">
                성별
              </label>
              <select
                className={ui.input}
                id="gender"
                name="gender"
                onChange={(event) => {
                  const value = event.target.value;
                  setGender(value === "" ? null : (value as UserGender));
                }}
                value={gender ?? ""}
              >
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value ?? ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-wadeal-line bg-white p-4">
          <h2 className="text-xs font-bold text-wadeal-muted">수신 설정</h2>
          <label className="mt-3 flex cursor-pointer items-start gap-2">
            <input
              checked={marketing}
              className="mt-0.5"
              onChange={(event) => setMarketing(event.target.checked)}
              type="checkbox"
            />
            <span className="text-xs font-medium leading-relaxed text-wadeal-muted">
              이벤트·혜택·공동구매 알림 수신에 동의합니다 (선택)
            </span>
          </label>
        </section>

        {feedback ?
          <p
            className={`rounded-lg px-3 py-2 text-xs font-semibold ${
              feedback.tone === "success" ?
                "bg-green-50 text-green-700"
              : "bg-red-50 text-wadeal-red"
            }`}
            role="status"
          >
            {feedback.message}
          </p>
        : null}

        <button
          className={`${ui.btnPrimary} w-full cursor-pointer`}
          disabled={isPending}
          type="submit"
        >
          {isPending ? "저장 중..." : "변경사항 저장"}
        </button>
      </form>

      {returnPath ?
        <Link className={`${ui.btnOutline} block text-center`} href={returnPath}>
          돌아가기
        </Link>
      : null}
    </div>
  );
}
