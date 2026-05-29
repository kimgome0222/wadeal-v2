import Link from "next/link";

import { SellerShell } from "@/components/seller-shell";
import { requireSeller } from "@/lib/auth/require-seller";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerSupportPage() {
  await requireSeller();

  return (
    <SellerShell title="고객센터">
      <div className="space-y-3">
        <div className={`${ui.panel} space-y-2`}>
          <p className="text-sm font-black text-wadeal-ink">판매자 지원</p>
          <p className="text-xs font-bold leading-relaxed text-wadeal-muted">
            정산, 상품 검수, 배송 관련 문의는 celloh 운영팀이 순차적으로 답변해 드려요.
          </p>
        </div>
        <Link className={`${ui.panelClickable} block space-y-1`} href="/seller/notices">
          <p className="text-sm font-black text-wadeal-ink">운영 공지</p>
          <p className="text-xs font-bold text-wadeal-muted">판매자 공지사항 확인</p>
        </Link>
        <Link className={`${ui.panelClickable} block space-y-1`} href="/seller/cs-reviews">
          <p className="text-sm font-black text-wadeal-ink">문의·리뷰</p>
          <p className="text-xs font-bold text-wadeal-muted">고객 리뷰 및 상품 문의 관리</p>
        </Link>
        <Link className={`${ui.panelClickable} block space-y-1`} href="/seller/notifications">
          <p className="text-sm font-black text-wadeal-ink">알림</p>
          <p className="text-xs font-bold text-wadeal-muted">운영 알림 및 처리 요청 확인</p>
        </Link>
      </div>
    </SellerShell>
  );
}
