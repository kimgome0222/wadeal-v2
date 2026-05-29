"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { requestPasswordResetAction } from "@/app/actions/auth/signup";
import { WadealLogo } from "@/components/wadeal-logo";
import { validateUsername, getUsernameValidationMessage } from "@/lib/auth/credentials";
import { ui } from "@/lib/ui";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function handleVerifyMock() {
    setPhoneVerified(true);
    setFeedback({
      tone: "success",
      message: "본인인증 연동 준비 중입니다. 개발 환경에서는 인증 완료로 처리됩니다.",
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const validation = validateUsername(username);
    if (!validation.valid) {
      setFeedback({ tone: "error", message: getUsernameValidationMessage(validation) });
      return;
    }

    startTransition(async () => {
      const result = await requestPasswordResetAction({ username, phoneVerified });

      if (!result.success) {
        const messages: Record<string, string> = {
          invalid_username: getUsernameValidationMessage(validation),
          phone_not_verified: "휴대폰 본인인증을 먼저 완료해 주세요.",
          user_not_found: "일치하는 계정을 찾지 못했어요.",
          provider_unavailable: "비밀번호 재설정을 준비 중이에요.",
          reset_failed: "재설정 요청에 실패했어요.",
        };
        setFeedback({
          tone: "error",
          message: messages[result.error] ?? "재설정 요청에 실패했어요.",
        });
        return;
      }

      setFeedback({ tone: "success", message: result.message });
    });
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 pb-10 pt-8">
      <div className="text-center">
        <WadealLogo href="/" size="md" variant="brand" />
        <h1 className="mt-5 text-xl font-black text-wadeal-ink">비밀번호 찾기</h1>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className={ui.label} htmlFor="username">
            아이디
          </label>
          <input
            autoComplete="username"
            className={ui.input}
            id="username"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
          />
        </div>

        {phoneVerified ?
          <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
            본인인증 완료
          </p>
        : <button
            className={`${ui.btnOutline} w-full cursor-pointer`}
            onClick={handleVerifyMock}
            type="button"
          >
            휴대폰 본인인증 (연동 준비 중)
          </button>
        }

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

        <button className={`${ui.btnPrimary} w-full cursor-pointer`} disabled={isPending} type="submit">
          {isPending ? "요청 중..." : "비밀번호 재설정 요청"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-bold text-wadeal-muted">
        <Link className="text-wadeal-red underline underline-offset-2" href="/login">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
