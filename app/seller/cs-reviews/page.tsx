import Link from "next/link";

import { SellerShell } from "@/components/seller-shell";
import { requireSeller } from "@/lib/auth/require-seller";
import { getSellerReviews } from "@/lib/data/seller-reviews";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerCsReviewsPage() {
  const seller = await requireSeller();
  const reviews = await getSellerReviews(seller.userId, "no_reply");
  const pendingReplyCount = reviews.length;

  return (
    <SellerShell title="문의·리뷰">
      <div className="grid gap-3 sm:grid-cols-2">
        <Link className={`${ui.panel} block space-y-2`} href="/seller/reviews">
          <p className="text-sm font-black text-wadeal-ink">리뷰 관리</p>
          <p className="text-xs font-bold text-wadeal-muted">
            본인 상품 리뷰 확인 및 답글 작성
            {pendingReplyCount > 0 ? ` · 답글 필요 ${pendingReplyCount}건` : ""}
          </p>
        </Link>
        <div className={`${ui.panel} space-y-2 opacity-80`}>
          <p className="text-sm font-black text-wadeal-ink">상품 문의</p>
          <p className="text-xs font-bold text-wadeal-muted">
            고객센터 문의는 알림 수신 후 순차 연동 예정입니다.
          </p>
        </div>
      </div>
    </SellerShell>
  );
}
