import Link from "next/link";

import { SellerCenterNoSellerState } from "@/components/seller-center-no-seller-state";
import { SellerShell } from "@/components/seller-shell";
import { getSellerCenterPageContext } from "@/lib/auth/seller-access";
import { SELLER_PRICING_PLANS } from "@/lib/sellers/seller-pricing-plans";
import { SELLER_POLICIES } from "@/lib/sellers/seller-center-guides";
import { ui } from "@/lib/ui";

const POLICY_LINKS = [
  { href: "/policies/seller", label: "판매자 정책 (전문)" },
  { href: "/policies/commerce", label: "전자상거래 안내" },
  { href: "/policies/refund", label: "환불/교환 정책" },
  { href: "/policies/shipping", label: "배송 정책" },
  { href: "/policies/payment", label: "정산·결제 정책" },
] as const;

export const dynamic = "force-dynamic";

export default async function SellerPoliciesPage() {
  const { seller } = await getSellerCenterPageContext("/seller/policies");

  if (!seller) {
    return (
      <SellerShell title="운영정책">
        <SellerCenterNoSellerState />
      </SellerShell>
    );
  }

  return (
    <SellerShell title="운영정책">
      <div className="space-y-4">
        <Link className="text-xs font-black text-wadeal-red" href="/seller/notices">
          ← 공지사항
        </Link>
        <div className={`${ui.panel} space-y-2`}>
          <p className="text-sm font-black text-wadeal-ink">정책 문서</p>
          <ul className="space-y-1">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link className="text-xs font-bold text-[#2E5E4E] underline" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={`${ui.panel} space-y-3`}>
          <p className="text-sm font-black text-wadeal-ink">판매자 플랜 (초안)</p>
          <p className="text-[11px] font-bold leading-relaxed text-wadeal-muted">
            구독 결제는 준비 중입니다. 수수료·혜택은 운영팀과 협의 후 확정됩니다.
          </p>
          <ul className="space-y-2">
            {SELLER_PRICING_PLANS.map((plan) => (
              <li
                className="rounded-xl border border-wadeal-line bg-wadeal-surface px-3 py-3"
                key={plan.id}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-black text-wadeal-ink">{plan.name}</p>
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-wadeal-muted">
                    {plan.status === "active" ? "기본" : "준비 중"}
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#2E5E4E]">{plan.tagline}</p>
                <p className="mt-1 text-[11px] font-bold text-wadeal-muted">{plan.priceLabel}</p>
                <ul className="mt-2 list-disc space-y-0.5 pl-4 text-[11px] font-medium text-wadeal-muted">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link className="text-xs font-bold text-[#2E5E4E] underline" href="/seller/finance/settlements">
              정산 내역 보기
            </Link>
            <Link className="text-xs font-bold text-[#2E5E4E] underline" href="/policies/seller">
              판매자 정책 전문 보기
            </Link>
          </div>
        </div>
        {SELLER_POLICIES.map((section) => (
          <div className={`${ui.panel} space-y-2`} key={section.title}>
            <p className="text-sm font-black text-wadeal-ink">{section.title}</p>
            <p className="text-xs font-bold leading-relaxed text-wadeal-muted">{section.body}</p>
          </div>
        ))}
      </div>
    </SellerShell>
  );
}
