"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateSellerProductAction } from "@/app/actions/seller-products";
import type { SellerProductEditDetail } from "@/lib/data/seller-products";
import { getProductApprovalStatusLabel } from "@/lib/products/approval-status";
import { ui } from "@/lib/ui";

type SellerProductEditFormProps = {
  product: SellerProductEditDetail;
};

export function SellerProductEditForm({ product }: SellerProductEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateSellerProductAction(product.productId, formData);
      setFeedback(result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className={`${ui.panel} space-y-2`}>
        <p className="text-xs font-bold text-wadeal-muted">
          슬러그: {product.slug} · 검수: {getProductApprovalStatusLabel(product.approvalStatus)}
        </p>
        {!product.canEditPricing ?
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
            판매 중인 상품은 가격·재고·혜택 조건·판매 종료일 변경이 제한돼요.
          </p>
        : null}
      </div>

      <input
        className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
        defaultValue={product.name}
        name="name"
        placeholder="상품명 *"
        required
      />
      <textarea
        className="min-h-24 w-full rounded-xl bg-gray-50 px-3 py-2 text-sm font-bold outline-none"
        defaultValue={product.description ?? ""}
        name="description"
        placeholder="상품 설명"
      />
      <input
        className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
        defaultValue={product.imageUrl ?? ""}
        name="imageUrl"
        placeholder="대표 이미지 URL"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none disabled:opacity-50"
          defaultValue={product.originalPrice}
          disabled={!product.canEditPricing}
          min={1}
          name="originalPrice"
          placeholder="정가 (원)"
          required
          type="number"
        />
        <input
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none disabled:opacity-50"
          defaultValue={product.groupPrice}
          disabled={!product.canEditPricing}
          min={1}
          name="groupPrice"
          placeholder="혜택가 (원) *"
          required
          type="number"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none disabled:opacity-50"
          defaultValue={product.targetParticipants}
          disabled={!product.canEditPricing}
          min={1}
          name="targetParticipants"
          placeholder="혜택 조건"
          required
          type="number"
        />
        <input
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none disabled:opacity-50"
          defaultValue={product.endsAtInput}
          disabled={!product.canEditPricing}
          name="endsAt"
          type="date"
        />
        <input
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none disabled:opacity-50"
          defaultValue={product.stockQuantity ?? ""}
          disabled={!product.canEditPricing}
          min={0}
          name="stockQuantity"
          placeholder="재고 (비우면 무제한)"
          type="number"
        />
      </div>

      {feedback ?
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-wadeal-muted" role="status">
          {feedback}
        </p>
      : null}

      <div className="flex gap-2">
        <button
          className={`${ui.btnPrimary} h-11 flex-1 disabled:opacity-50`}
          disabled={isPending}
          type="submit"
        >
          {isPending ? "저장 중..." : "저장"}
        </button>
        <Link className={`${ui.btnOutline} inline-flex h-11 flex-1 items-center justify-center text-xs`} href="/seller/products">
          목록
        </Link>
      </div>
    </form>
  );
}
