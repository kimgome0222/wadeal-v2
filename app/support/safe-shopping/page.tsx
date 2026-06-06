import Link from "next/link";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SubHeader } from "@/components/sub-header";
import {
  SAFE_SHOPPING_DISCLAIMER,
  SAFE_SHOPPING_POLICY_LINKS,
  SAFE_SHOPPING_SECTIONS,
} from "@/lib/support/safe-shopping-content";
import { ui } from "@/lib/ui";

export default function SafeShoppingPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="안전구매 안내" />
      <div className={`${ui.pageBody} space-y-5 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        <div className={`${ui.panel} space-y-2`}>
          <p className="text-sm font-bold text-wadeal-ink">안전하게 구매하기</p>
          <p className="text-xs font-medium leading-relaxed text-wadeal-muted">
            좋은 판매자를 확인하고, celloh 안에서 주문·결제해 주세요.
          </p>
          <p className="text-[10px] leading-relaxed text-wadeal-muted">{SAFE_SHOPPING_DISCLAIMER}</p>
        </div>

        {SAFE_SHOPPING_SECTIONS.map((section) => (
          <section className={`${ui.panel} space-y-2`} key={section.title}>
            <h2 className="text-sm font-bold text-wadeal-ink">{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p className="text-xs font-medium leading-relaxed text-wadeal-muted" key={paragraph}>
                {paragraph}
              </p>
            ))}
            {section.bullets?.length ?
              <ul className="list-disc space-y-1 pl-4 text-xs font-medium text-wadeal-muted">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            : null}
          </section>
        ))}

        <section className={`${ui.panel} space-y-2`}>
          <h2 className="text-sm font-bold text-wadeal-ink">관련 정책</h2>
          <div className="flex flex-wrap gap-2">
            {SAFE_SHOPPING_POLICY_LINKS.map((link) => (
              <Link
                className="rounded-full border border-wadeal-line bg-white px-3 py-1.5 text-[11px] font-semibold text-wadeal-ink hover:bg-wadeal-surface"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-2 sm:grid-cols-2">
          <Link className={`${ui.btnPrimary} flex h-12 items-center justify-center text-sm`} href="/support/contact">
            1:1 문의
          </Link>
          <Link className={`${ui.btnOutline} flex h-12 items-center justify-center text-sm`} href="/reports">
            신고하기
          </Link>
        </div>
      </div>
    </AppBuyerLayout>
  );
}
