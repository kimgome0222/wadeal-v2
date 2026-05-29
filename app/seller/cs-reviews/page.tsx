import Link from "next/link";

import { SellerShell } from "@/components/seller-shell";
import { requireSeller } from "@/lib/auth/require-seller";
import { getSellerProductInquiries } from "@/lib/data/seller-product-inquiries";
import { getSellerReviews } from "@/lib/data/seller-reviews";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerCsReviewsPage() {
  const seller = await requireSeller();
  const [reviews, pendingInquiries] = await Promise.all([
    getSellerReviews(seller.userId, "no_reply"),
    getSellerProductInquiries(seller.userId, "no_reply"),
  ]);
  const pendingReplyCount = reviews.length;
  const pendingInquiryCount = pendingInquiries.length;

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
        <Link className={`${ui.panel} block space-y-2`} href="/seller/inquiries">
          <p className="text-sm font-black text-wadeal-ink">상품 문의</p>
          <p className="text-xs font-bold text-wadeal-muted">
            PDP Q&amp;A 문의 확인 및 답변
            {pendingInquiryCount > 0 ? ` · 답변 필요 ${pendingInquiryCount}건` : ""}
          </p>
        </Link>
      </div>
    </SellerShell>
  );
}
