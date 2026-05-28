import Link from "next/link";

import { SellerShell } from "@/components/seller-shell";
import { requireSeller } from "@/lib/auth/require-seller";
import { SELLER_POLICIES } from "@/lib/sellers/seller-center-guides";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerPoliciesPage() {
  await requireSeller();

  return (
    <SellerShell title="운영정책">
      <div className="space-y-4">
        <Link className="text-xs font-black text-wadeal-red" href="/seller/notices">
          ← 공지사항
        </Link>
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
