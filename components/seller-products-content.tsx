"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { submitSellerProductForReviewAction } from "@/app/actions/seller-products";
import {
  adminProductStatusLabel,
  formatAdminProductDeadline,
} from "@/lib/admin-products/shared";
import { currency } from "@/lib/deals";
import type { SellerProductListItem } from "@/lib/data/seller-products";
import {
  approvalStatusTone,
  getProductApprovalStatusLabel,
} from "@/lib/products/approval-status";
import { ui } from "@/lib/ui";

type SellerProductsContentProps = {
  products: SellerProductListItem[];
};

function dealStatusTone(status: SellerProductListItem["dealStatus"]) {
  if (status === "active") {
    return "bg-green-50 text-green-700";
  }

  if (status === "ended") {
    return "bg-gray-100 text-wadeal-muted";
  }

  return "bg-amber-50 text-amber-700";
}

export function SellerProductsContent({ products }: SellerProductsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmitForReview(productId: string) {
    setFeedback(null);
    startTransition(async () => {
      const result = await submitSellerProductForReviewAction(productId);
      setFeedback(result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  if (products.length === 0) {
    return (
      <div className={`${ui.panel} py-10 text-center`}>
        <p className="text-sm font-black text-wadeal-ink">등록된 상품이 없어요.</p>
        <p className="mt-1 text-xs font-bold text-wadeal-muted">
          관리자 또는 운영팀을 통해 상품이 연결되면 여기에 표시돼요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-wadeal-muted">
        총 {products.length.toLocaleString("ko-KR")}개 · 검수 상태를 확인하고 재요청할 수 있어요.
      </p>

      {feedback ?
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-wadeal-muted" role="status">
          {feedback}
        </p>
      : null}

      {products.map((product) => (
        <article className={`${ui.panel} space-y-3`} key={product.productId}>
          <div className="flex gap-3">
            {product.imageUrl ?
              <img
                alt={product.name}
                className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 object-cover"
                src={product.imageUrl}
              />
            : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-bold text-wadeal-muted">
                No image
              </div>
            }
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-black text-wadeal-ink">{product.name}</p>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-black ${approvalStatusTone(product.approvalStatus)}`}
                  >
                    {getProductApprovalStatusLabel(product.approvalStatus)}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-black ${dealStatusTone(product.dealStatus)}`}
                  >
                    {adminProductStatusLabel(product.dealStatus)}
                  </span>
                </div>
              </div>
              <p className="mt-0.5 truncate text-xs font-bold text-wadeal-muted">{product.slug}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold">
                <span className="font-black text-wadeal-red">
                  {currency.format(product.groupPrice)}원
                </span>
                <span className="text-wadeal-muted line-through">
                  {currency.format(product.originalPrice)}원
                </span>
                <span className="text-wadeal-red">{product.discountRate}%</span>
              </div>
            </div>
          </div>

          <dl className="space-y-1.5 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>참여 / 목표</dt>
              <dd className="font-black text-wadeal-ink">
                {product.currentParticipants.toLocaleString("ko-KR")} /{" "}
                {product.targetParticipants.toLocaleString("ko-KR")}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>마감일</dt>
              <dd className="font-black text-wadeal-ink">
                {formatAdminProductDeadline(product.endsAt)}
              </dd>
            </div>
          </dl>

          {product.approvalStatus === "rejected" && product.rejectedReason ?
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-wadeal-red">
              반려 사유: {product.rejectedReason}
            </p>
          : null}

          {(product.approvalStatus === "draft" || product.approvalStatus === "rejected") ?
            <button
              className={`${ui.btnPrimary} h-10 w-full disabled:opacity-50`}
              disabled={isPending}
              onClick={() => handleSubmitForReview(product.productId)}
              type="button"
            >
              {isPending ? "처리 중..." : "검수 요청"}
            </button>
          : null}

          <a
            className={`${ui.btnOutline} inline-flex h-10 w-full items-center justify-center text-xs`}
            href={`/seller/products/${product.productId}/edit`}
          >
            상품 수정
          </a>

          {product.approvalStatus === "pending_review" ?
            <p className="text-xs font-bold text-wadeal-muted">
              관리자 검수가 진행 중이에요. 결과는 알림으로 안내돼요.
            </p>
          : null}
        </article>
      ))}
    </div>
  );
}
