import Link from "next/link";

import { SellerInquiriesMockPanel } from "@/components/seller/seller-inquiries-mock-panel";
import { SellerReviewsMockPanel } from "@/components/seller/seller-reviews-mock-panel";
import { EmptyState } from "@/components/empty-state";
import { SellerCenterNoSellerState } from "@/components/seller-center-no-seller-state";
import { SellerShell } from "@/components/seller-shell";
import { getSellerCenterPageContext } from "@/lib/auth/seller-access";
import { getSellerProductInquiries } from "@/lib/data/seller-product-inquiries";
import { getSellerReviews } from "@/lib/data/seller-reviews";
import { showSellerCenterMock } from "@/lib/sellers/show-seller-mock";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerCsReviewsPage() {
  const { seller } = await getSellerCenterPageContext("/seller/cs-reviews");

  if (!seller) {
    return (
      <SellerShell title="문의·리뷰">
        <SellerCenterNoSellerState />
      </SellerShell>
    );
  }

  const [reviews, allInquiries, pendingInquiries] = await Promise.all([
    getSellerReviews(seller.userId, "all"),
    getSellerProductInquiries(seller.userId, "all"),
    getSellerProductInquiries(seller.userId, "no_reply"),
  ]);
  const pendingReplyCount = reviews.filter((review) => !review.hasReply).length;
  const pendingInquiryCount = pendingInquiries.length;

  return (
    <SellerShell title="문의·리뷰">
      <div className="space-y-4">
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

        {reviews.length === 0 && allInquiries.length === 0 ?
          showSellerCenterMock() ?
            <div className="space-y-6">
              <SellerReviewsMockPanel />
              <SellerInquiriesMockPanel />
            </div>
          : <div className="grid gap-3 sm:grid-cols-2">
              <EmptyState
                description="고객 리뷰가 등록되면 이곳에서 답글을 작성할 수 있어요."
                title="아직 리뷰가 없어요."
              />
              <EmptyState
                description="고객 문의가 들어오면 이곳에서 답변할 수 있어요."
                title="아직 문의가 없어요."
              />
            </div>
        : null}
      </div>
    </SellerShell>
  );
}
