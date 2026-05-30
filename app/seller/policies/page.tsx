import Link from "next/link";

import { SellerCenterNoSellerState } from "@/components/seller-center-no-seller-state";
import { SellerShell } from "@/components/seller-shell";
import { getSellerCenterPageContext } from "@/lib/auth/seller-access";
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
