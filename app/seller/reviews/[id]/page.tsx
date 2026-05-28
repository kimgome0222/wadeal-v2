import Link from "next/link";
import { notFound } from "next/navigation";

import { SellerReviewReplyForm } from "@/components/seller-review-reply-form";
import { SellerShell } from "@/components/seller-shell";
import { requireSeller } from "@/lib/auth/require-seller";
import { getSellerReviewById } from "@/lib/data/seller-reviews";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const seller = await requireSeller();
  const { id } = await params;
  const review = await getSellerReviewById(seller.userId, id);

  if (!review) {
    notFound();
  }

  return (
    <SellerShell title="리뷰 상세">
      <div className="space-y-4">
        <Link className="text-xs font-black text-wadeal-red" href="/seller/reviews">
          ← 리뷰 목록
        </Link>

        <div className={`${ui.panel} space-y-3`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-wadeal-ink">{review.productName}</p>
              <p className="mt-1 text-xs font-bold text-wadeal-muted">
                {review.author} · {review.createdAt}
                {review.isVerifiedPurchase ? " · 구매확정" : ""}
              </p>
            </div>
            <p className="text-lg font-black text-wadeal-red">{review.rating}점</p>
          </div>
          <p className="text-sm font-bold leading-relaxed text-wadeal-ink">{review.content}</p>
          {review.images.length > 0 ?
            <div className="flex flex-wrap gap-2">
              {review.images.map((image) => (
                <img
                  alt="리뷰 이미지"
                  className="h-20 w-20 rounded-lg object-cover"
                  key={image}
                  src={image}
                />
              ))}
            </div>
          : null}
          {review.orderId ?
            <p className="text-[11px] font-bold text-wadeal-muted">주문 ID: {review.orderId}</p>
          : null}
          {review.isReported ?
            <p className="text-[11px] font-black text-amber-700">관리자 확인이 필요한 신고 리뷰예요.</p>
          : null}
        </div>

        {review.reply ?
          <div className={`${ui.panel} space-y-2`}>
            <p className="text-xs font-black text-wadeal-muted">등록된 답글</p>
            <p className="text-sm font-bold leading-relaxed text-wadeal-ink">{review.reply.body}</p>
            <p className="text-[10px] font-bold text-wadeal-muted">
              {new Date(review.reply.updatedAt).toLocaleString("ko-KR")}
            </p>
          </div>
        : null}

        <SellerReviewReplyForm initialBody={review.reply?.body ?? ""} reviewId={review.id} />
      </div>
    </SellerShell>
  );
}
