"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { resetPasswordAction } from "@/app/actions/auth/signup";
import { WadealLogo } from "@/components/wadeal-logo";
import {
  getPasswordValidationMessage,
  validatePassword,
} from "@/lib/auth/credentials";
import { ui } from "@/lib/ui";

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const validation = validatePassword(password);
    if (!validation.valid) {
      setFeedback({
        tone: "error",
        message: getPasswordValidationMessage(validation),
      });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({ tone: "error", message: "비밀번호 확인이 일치하지 않아요." });
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction({ password, confirmPassword });

      if (!result.success) {
        const messages: Record<string, string> = {
          login_required: "로그인 후 비밀번호를 재설정할 수 있어요.",
          invalid_password: result.message ?? "비밀번호를 확인해 주세요.",
          password_mismatch: "비밀번호 확인이 일치하지 않아요.",
          provider_unavailable: "비밀번호 재설정을 준비 중이에요.",
          update_failed: "비밀번호 변경에 실패했어요.",
        };
        setFeedback({
          tone: "error",
          message: messages[result.error] ?? "비밀번호 변경에 실패했어요.",
        });
        return;
      }

      setFeedback({
        tone: "success",
        message: "비밀번호가 변경됐어요. 다시 로그인해 주세요.",
      });
    });
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 pb-10 pt-8">
      <div className="text-center">
        <WadealLogo href="/" size="md" variant="brand" />
        <h1 className="mt-5 text-xl font-black text-wadeal-ink">비밀번호 재설정</h1>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className={ui.label} htmlFor="password">
            새 비밀번호
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
          {isPending ? "변경 중..." : "비밀번호 변경"}
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
