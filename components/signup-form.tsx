"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  checkUsernameAvailabilityAction,
  signUpWithUsernameAction,
} from "@/app/actions/auth/signup";
import { UserConsentForm } from "@/components/user-consent-form";
import { WadealLogo } from "@/components/wadeal-logo";
import {
  getPasswordValidationMessage,
  getUsernameValidationMessage,
  validatePassword,
  validateUsername,
} from "@/lib/auth/credentials";
import type { ConsentFormValues } from "@/lib/consents/types";
import { EMPTY_CONSENT_FORM } from "@/lib/consents/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ui } from "@/lib/ui";

export function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCheckingUsername, startUsernameCheck] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [realName, setRealName] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [consentValues, setConsentValues] = useState<ConsentFormValues>(EMPTY_CONSENT_FORM);
  const [consentComplete, setConsentComplete] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  const supabaseReady = isSupabaseConfigured();

  function handleCheckUsername() {
    setFeedback(null);
    setUsernameChecked(false);
    setUsernameAvailable(false);

    const validation = validateUsername(username);
    if (!validation.valid) {
      setFeedback({ tone: "error", message: getUsernameValidationMessage(validation) });
      return;
    }

    startUsernameCheck(async () => {
      const result = await checkUsernameAvailabilityAction(username);
      setUsernameChecked(true);
      setUsernameAvailable(result.available);
      setFeedback({
        tone: result.available ? "success" : "error",
        message: result.message,
      });
    });
  }

  function handlePhoneVerificationMock() {
    setPhoneVerified(true);
    setFeedback({
      tone: "success",
      message: "본인인증 연동 준비 중입니다. 개발 환경에서는 인증 완료로 처리됩니다.",
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!usernameChecked || !usernameAvailable) {
      setFeedback({ tone: "error", message: "아이디 중복 확인을 먼저 해 주세요." });
      return;
    }

    if (!consentComplete) {
      setFeedback({ tone: "error", message: "필수 약관에 동의해 주세요." });
      return;
    }

    const passwordValidation = validatePassword(password, username);
    if (!passwordValidation.valid) {
      setFeedback({
        tone: "error",
        message: getPasswordValidationMessage(passwordValidation),
      });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({ tone: "error", message: "비밀번호 확인이 일치하지 않아요." });
      return;
    }

    startTransition(async () => {
      const result = await signUpWithUsernameAction({
        username,
        password,
        confirmPassword,
        realName,
        phoneVerified,
        consents: consentValues,
      });

      if (!result.success) {
        const messages: Record<string, string> = {
          invalid_username: "아이디를 확인해 주세요.",
          invalid_name: "실명을 입력해 주세요.",
          phone_not_verified: "휴대폰 본인인증을 완료해 주세요.",
          consent_required: "필수 약관에 동의해 주세요.",
          invalid_password: getPasswordValidationMessage(validatePassword(password, username)),
          password_mismatch: "비밀번호 확인이 일치하지 않아요.",
          username_taken: "이미 사용 중인 아이디예요.",
          provider_unavailable: "회원가입 서비스를 준비 중이에요. Supabase 설정을 확인해 주세요.",
          signup_failed: "회원가입에 실패했어요. 다시 시도해 주세요.",
        };
        setFeedback({
          tone: "error",
          message: messages[result.error] ?? "회원가입에 실패했어요.",
        });
        return;
      }

      router.push("/mypage");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 pb-10 pt-8">
      <div className="text-center">
        <WadealLogo href="/" size="md" variant="brand" />
        <h1 className="mt-5 text-xl font-black text-wadeal-ink">회원가입</h1>
        <p className="mt-2 text-sm font-bold text-wadeal-muted">
          Wadeal 공동구매에 오신 것을 환영해요
        </p>
      </div>

      {!supabaseReady ?
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-center text-xs font-bold text-amber-800">
          Supabase 연결 후 일반 회원가입이 활성화됩니다.
        </p>
      : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className={ui.label} htmlFor="username">
            아이디
          </label>
          <div className="flex gap-2">
            <input
              autoComplete="username"
              className={ui.input}
              id="username"
              onChange={(event) => {
                setUsername(event.target.value);
                setUsernameChecked(false);
                setUsernameAvailable(false);
              }}
              placeholder="6~20자 영문 소문자, 숫자, _"
              value={username}
            />
            <button
              className={`${ui.btnOutline} shrink-0 cursor-pointer px-3`}
              disabled={isCheckingUsername}
              onClick={handleCheckUsername}
              type="button"
            >
              {isCheckingUsername ? "확인 중" : "중복확인"}
            </button>
          </div>
        </div>

        <div>
          <label className={ui.label} htmlFor="password">
            비밀번호
          </label>
          <input
            autoComplete="new-password"
            className={ui.input}
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </div>

        <div>
          <label className={ui.label} htmlFor="confirmPassword">
            비밀번호 확인
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

        <div>
          <label className={ui.label} htmlFor="realName">
            실명
          </label>
          <input
            className={ui.input}
            id="realName"
            onChange={(event) => setRealName(event.target.value)}
            placeholder="실명"
            required
            value={realName}
          />
        </div>

        <div>
          <p className={ui.label}>휴대폰 본인인증</p>
          {phoneVerified ?
            <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
              본인인증 완료
            </p>
          : <button
              className={`${ui.btnOutline} w-full cursor-pointer`}
              onClick={handlePhoneVerificationMock}
              type="button"
            >
              휴대폰 본인인증 (연동 준비 중)
            </button>
          }
          <p className="mt-2 text-[11px] font-medium text-wadeal-muted">
            주민등록번호는 저장하지 않으며, 인증 결과값만 저장합니다.
          </p>
        </div>

        <UserConsentForm
          onValuesChange={(values, allRequiredChecked) => {
            setConsentValues(values);
            setConsentComplete(allRequiredChecked);
          }}
          variant="compact"
        />

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
          className={`${ui.btnPrimary} w-full cursor-pointer`}
          disabled={isPending || !supabaseReady}
          type="submit"
        >
          {isPending ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-bold text-wadeal-muted">
        이미 계정이 있으신가요?{" "}
        <Link className="text-wadeal-red underline underline-offset-2" href="/login">
          로그인
        </Link>
      </p>
    </div>
  );
}
