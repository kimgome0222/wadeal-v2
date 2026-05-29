import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ui } from "@/lib/ui";

const COPY = {
  title: "사업자 정보 등록이 필요해요",
  description:
    "상품 등록과 정산 관리를 이용하려면 사업자 정보를 먼저 등록해주세요.",
  actionLabel: "사업자 정보 등록하기",
  actionHref: "/seller/settings",
} as const;

export function SellerBusinessInfoRequired() {
  return (
    <div className="space-y-4">
      <EmptyState
        actionHref={COPY.actionHref}
        actionLabel={COPY.actionLabel}
        description={COPY.description}
        title={COPY.title}
      />
      <div className={`${ui.panel} space-y-2`}>
        <p className="text-xs font-black text-wadeal-ink">등록 안내</p>
        <ul className="space-y-1 text-xs font-bold text-wadeal-muted">
          <li>· 상호명, 사업자등록번호, 대표자명</li>
          <li>· 정산 계좌 (정산 관리 이용 시)</li>
          <li>· 관리자 승인 후 상품 등록·정산이 가능해요</li>
        </ul>
        <Link
          className="inline-flex text-xs font-black text-wadeal-red underline underline-offset-2"
          href="/seller/apply"
        >
          판매자 신청 페이지로 이동 →
        </Link>
      </div>
    </div>
  );
}
