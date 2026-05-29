"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { findUsernameAction } from "@/app/actions/auth/signup";
import { WadealLogo } from "@/components/wadeal-logo";
import { ui } from "@/lib/ui";

export function ForgotUsernameForm() {
  const [isPending, startTransition] = useTransition();
  const [realName, setRealName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [usernames, setUsernames] = useState<string[]>([]);
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
    setUsernames([]);
    setFeedback(null);

    startTransition(async () => {
      const result = await findUsernameAction({ realName, phone, phoneVerified });

      if (!result.success) {
        const messages: Record<string, string> = {
          phone_not_verified: "휴대폰 본인인증을 먼저 완료해 주세요.",
          not_found: "일치하는 아이디를 찾지 못했어요.",
          lookup_failed: "아이디 찾기를 처리할 수 없어요.",
        };
        setFeedback({
          tone: "error",
          message: messages[result.error] ?? "아이디 찾기에 실패했어요.",
        });
        return;
      }

      setUsernames(result.usernames);
      setFeedback({ tone: "success", message: "가입된 아이디를 확인했어요." });
    });
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 pb-10 pt-8">
      <div className="text-center">
        <WadealLogo href="/" size="md" variant="brand" />
        <h1 className="mt-5 text-xl font-black text-wadeal-ink">아이디 찾기</h1>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className={ui.label} htmlFor="realName">
            실명
          </label>
          <input
            className={ui.input}
            id="realName"
            onChange={(event) => setRealName(event.target.value)}
            required
            value={realName}
          />
        </div>

        <div>
          <label className={ui.label} htmlFor="phone">
            휴대폰 번호
          </label>
          <input
            className={ui.input}
            id="phone"
            inputMode="numeric"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="010-0000-0000"
            required
            value={phone}
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
              : "bg-[#F5F8F4] text-wadeal-red"
            }`}
          >
            {feedback.message}
          </p>
        : null}

        {usernames.length > 0 ?
          <div className="rounded-xl border border-wadeal-line bg-white p-4">
            <p className="text-xs font-bold text-wadeal-muted">가입된 아이디</p>
            <ul className="mt-2 space-y-1">
              {usernames.map((masked) => (
                <li className="text-sm font-black text-wadeal-ink" key={masked}>
                  {masked}
                </li>
              ))}
            </ul>
          </div>
        : null}

        <button className={`${ui.btnPrimary} w-full cursor-pointer`} disabled={isPending} type="submit">
          {isPending ? "찾는 중..." : "아이디 찾기"}
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
