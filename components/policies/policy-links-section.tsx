"use client";

import Link from "next/link";

import { POLICY_SETTINGS_LINKS } from "@/lib/policies/registry";

type PolicyLinksSectionProps = {
  title?: string;
  compact?: boolean;
};

/** 마이페이지·설정 하단 정책 링크 모음 */
export function PolicyLinksSection({
  title = "약관 및 정책",
  compact = false,
}: PolicyLinksSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[16px] font-bold text-[#111111]">{title}</h2>
      <ul
        className={
          compact ?
            "flex flex-wrap gap-x-3 gap-y-2"
          : "overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white"
        }
      >
        {POLICY_SETTINGS_LINKS.map((link) =>
          compact ?
            <li key={link.href}>
              <Link
                className="text-[13px] font-medium text-[#666666] underline-offset-2 hover:text-[#2E5E4E] hover:underline"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          : (
            <li className="border-b border-[#E8ECEA] last:border-b-0" key={link.href}>
              <Link
                className="flex min-h-[44px] items-center justify-between px-4 text-[14px] font-medium text-[#111111] active:bg-[#FAFBFA]"
                href={link.href}
              >
                {link.label}
                <span aria-hidden className="text-[#999999]">
                  ›
                </span>
              </Link>
            </li>
          ),
        )}
      </ul>
      <p className="text-[11px] leading-relaxed text-[#999999]">
        모든 정책 문서는 운영 초안이며, 정식 오픈 전 법무·개인정보 검토가 필요합니다.
      </p>
    </section>
  );
}
