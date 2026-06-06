"use client";

import Link from "next/link";

import {
  INQUIRY_CATEGORY_GROUPS,
  type InquiryChannel,
  buildInquiryNewHref,
} from "@/lib/support/inquiry-options";
import { ui } from "@/lib/ui";

type SupportInquiryHubProps = {
  customerServiceEmail?: string | null;
  customerServicePhone?: string | null;
  /** 카카오 채널 URL — 미설정 시 앱 내 문의로 안내 */
  kakaoChannelUrl?: string | null;
};

const CHANNELS: {
  id: InquiryChannel;
  label: string;
  description: string;
  accent: string;
}[] = [
  {
    id: "kakao",
    label: "카카오톡으로 문의",
    description: "평일 09:00–18:00 · 빠른 답변",
    accent: "bg-[#fee500] text-[#3c1e1e]",
  },
  {
    id: "email",
    label: "이메일로 문의",
    description: "24시간 접수 · 영업일 답변",
    accent: "bg-wadeal-surface text-wadeal-ink ring-1 ring-wadeal-line",
  },
  {
    id: "app",
    label: "1:1 문의 등록",
    description: "문의 유형 선택 후 접수",
    accent: "bg-wadeal-red text-white",
  },
];

export function SupportInquiryHub({
  customerServiceEmail,
  customerServicePhone,
  kakaoChannelUrl,
}: SupportInquiryHubProps) {
  function handleChannelClick(channel: InquiryChannel) {
    if (channel === "email" && customerServiceEmail) {
      window.location.href = `mailto:${customerServiceEmail}?subject=${encodeURIComponent("[celloh] 고객센터 문의")}`;
      return;
    }

    if (channel === "kakao" && kakaoChannelUrl) {
      window.open(kakaoChannelUrl, "_blank", "noopener,noreferrer");
      return;
    }
  }

  return (
    <div className="space-y-4">
      <section className={`${ui.card} p-4`}>
        <h2 className="text-sm font-bold text-wadeal-ink">문의 방법</h2>
        <p className="mt-1 text-xs font-medium text-wadeal-muted">
          원하시는 방법으로 문의해 주세요.
        </p>
        <div className="mt-3 space-y-2">
          {CHANNELS.map((channel) => {
            if (channel.id === "app") {
              return (
                <Link
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3.5 text-left active:opacity-90 ${channel.accent}`}
                  href={buildInquiryNewHref({ channel: "app" })}
                  key={channel.id}
                >
                  <div>
                    <p className="text-sm font-bold">{channel.label}</p>
                    <p className="mt-0.5 text-[11px] font-medium opacity-80">{channel.description}</p>
                  </div>
                  <span aria-hidden>›</span>
                </Link>
              );
            }

            const disabled =
              (channel.id === "email" && !customerServiceEmail) ||
              (channel.id === "kakao" && !kakaoChannelUrl);

            return (
              <button
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3.5 text-left active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${channel.accent}`}
                disabled={disabled}
                key={channel.id}
                onClick={() => handleChannelClick(channel.id)}
                type="button"
              >
                <div>
                  <p className="text-sm font-bold">{channel.label}</p>
                  <p className="mt-0.5 text-[11px] font-medium opacity-80">
                    {disabled ?
                      "준비 중 · 1:1 문의를 이용해 주세요"
                    : channel.description}
                  </p>
                </div>
                <span aria-hidden>›</span>
              </button>
            );
          })}
        </div>
        {customerServicePhone ?
          <p className="mt-3 text-[11px] font-medium text-wadeal-muted">
            고객센터 전화 {customerServicePhone}
          </p>
        : null}
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold text-wadeal-muted">무엇을 도와드릴까요?</h2>
        <div className="space-y-3">
          {INQUIRY_CATEGORY_GROUPS.map((group) => (
            <div
              className="overflow-hidden rounded-2xl border border-wadeal-line bg-white shadow-card"
              key={group.id}
            >
              <p className="border-b border-wadeal-line bg-wadeal-surface px-4 py-2.5 text-xs font-bold text-wadeal-ink">
                {group.label}
              </p>
              <ul className="divide-y divide-wadeal-line">
                {group.subcategories.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      className="flex cursor-pointer items-center justify-between px-4 py-3.5 transition-colors hover:bg-wadeal-surface active:bg-wadeal-surface"
                      href={buildInquiryNewHref({ subId: sub.id, channel: "app" })}
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-sm font-semibold text-wadeal-ink">{sub.label}</p>
                        {sub.requiresOrder ?
                          <p className="mt-0.5 text-[11px] font-medium text-wadeal-muted">
                            최근 15일 이내 구매 상품 선택
                          </p>
                        : null}
                      </div>
                      <span aria-hidden className="shrink-0 text-gray-400">
                        ›
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        <Link className={`${ui.btnOutline} block text-center text-sm`} href="/support/faq">
          FAQ
        </Link>
        <Link className={`${ui.btnOutline} block text-center text-sm`} href="/support/tickets">
          내 문의 내역
        </Link>
      </div>
    </div>
  );
}
