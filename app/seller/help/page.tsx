import Link from "next/link";

import { SellerCenterNoSellerState } from "@/components/seller-center-no-seller-state";
import { SellerShell } from "@/components/seller-shell";
import { getSellerCenterPageContext } from "@/lib/auth/seller-access";
import { SELLER_HELP_LINKS } from "@/lib/sellers/seller-center-guides";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerHelpPage() {
  const { seller } = await getSellerCenterPageContext("/seller/help");

  if (!seller) {
    return (
      <SellerShell title="도움말">
        <SellerCenterNoSellerState />
      </SellerShell>
    );
  }

  return (
    <SellerShell title="도움말">
      <div className="space-y-4">
        <Link className="text-xs font-black text-wadeal-red" href="/seller/policies">
          ← 운영정책
        </Link>
        <p className="text-[11px] font-bold leading-relaxed text-wadeal-muted">
          입점·상품·스토리 가이드 초안입니다. 법무·세무 검토 전이며, 상세 문서는 운영팀과
          협의 후 확정됩니다.
        </p>
        <ul className="space-y-2">
          {SELLER_HELP_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                className={`${ui.panel} block space-y-1 transition hover:border-[#2E5E4E]/30`}
                href={link.href}
              >
                <p className="text-sm font-black text-wadeal-ink">{link.label}</p>
                <p className="text-[11px] font-bold leading-relaxed text-wadeal-muted">
                  {link.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className={`${ui.panel} space-y-1`}>
          <p className="text-xs font-black text-wadeal-ink">더 보기</p>
          <Link className="text-xs font-bold text-[#2E5E4E] underline" href="/seller/resources">
            자료실
          </Link>
          <span className="text-wadeal-muted"> · </span>
          <Link className="text-xs font-bold text-[#2E5E4E] underline" href="/seller/notices">
            공지사항
          </Link>
        </div>
      </div>
    </SellerShell>
  );
}
