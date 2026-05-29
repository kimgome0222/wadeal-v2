"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createSellerProductRequestAction } from "@/app/actions/seller-product-requests";
import type { CategoryRecord } from "@/lib/data/categories";
import { ui } from "@/lib/ui";

type SellerProductRequestFormProps = {
  categories: CategoryRecord[];
};

export function SellerProductRequestForm({ categories }: SellerProductRequestFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      const result = await createSellerProductRequestAction(formData);
      setFeedback(result.message);
      if (result.success) {
        router.push("/seller/product-requests");
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <input
        className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
        name="productName"
        placeholder="상품명 *"
        required
      />
      <select
        className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
        name="categoryId"
      >
        <option value="">카테고리 선택</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <textarea
        className="min-h-24 w-full rounded-xl bg-gray-50 px-3 py-2 text-sm font-bold outline-none"
        name="description"
        placeholder="상품 설명"
      />
      <input
        className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
        name="imageUrls"
        placeholder="이미지 URL (쉼표로 구분)"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
          min={1}
          name="originalPrice"
          placeholder="정가 (원)"
          type="number"
        />
        <input
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
          min={1}
          name="groupPrice"
          placeholder="공동구매가 (원) *"
          required
          type="number"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
          min={1}
          name="targetParticipants"
          placeholder="목표 인원"
          type="number"
        />
        <input
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm font-bold outline-none"
          name="endsAt"
          type="date"
        />
      </div>
      <div className="flex gap-2">
        <Link className={`${ui.btnOutline} h-11 flex-1 text-center leading-[2.75rem]`} href="/seller/products">
          취소
        </Link>
        <button className={`${ui.btnPrimary} h-11 flex-1 disabled:opacity-50`} disabled={isPending} type="submit">
          {isPending ? "접수 중..." : "등록 요청"}
        </button>
      </div>
      {feedback ?
        <p className="text-xs font-bold text-wadeal-muted" role="status">
          {feedback}
        </p>
      : null}
    </form>
  );
}
