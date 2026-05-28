"use client";

import Link from "next/link";
import { AdminFinalizeDealButton } from "@/components/admin-finalize-deal-button";
import {
  AdminProductApprovalBadge,
  AdminProductReviewActions,
} from "@/components/admin-product-review-actions";
import {
  adminProductStatusLabel,
  computeDiscountRate,
  formatAdminProductDeadline,
  type AdminProductListItem,
} from "@/lib/admin-products/shared";
import { currency } from "@/lib/deals";
import {
  PRODUCT_APPROVAL_FILTER_OPTIONS,
  type ProductApprovalFilter,
} from "@/lib/products/approval-status";
import { ui } from "@/lib/ui";

type AdminProductsContentProps = {
  products: AdminProductListItem[];
  approvalFilter: ProductApprovalFilter;
};

function statusTone(status: AdminProductListItem["status"]) {
  if (status === "active") {
    return "bg-green-50 text-green-700";
  }

  if (status === "ended") {
    return "bg-gray-100 text-wadeal-muted";
  }

  return "bg-amber-50 text-amber-700";
}

export function AdminProductsContent({
  products,
  approvalFilter,
}: AdminProductsContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRODUCT_APPROVAL_FILTER_OPTIONS.map((option) => {
          const active = approvalFilter === option.value;
          return (
            <Link
              className={`rounded-full px-3 py-1.5 text-xs font-black ${
                active
                  ? "bg-wadeal-ink text-white"
                  : "border border-wadeal-line bg-white text-wadeal-muted"
              }`}
              href={
                option.value === "all"
                  ? "/admin/products"
                  : `/admin/products?approval=${option.value}`
              }
              key={option.value}
            >
              {option.label}
            </Link>
          );
        })}
      </div>

      {products.length === 0 ?
        <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
          <p className="text-sm font-black text-wadeal-ink">등록된 상품이 없어요.</p>
          <p className="mt-1 text-xs font-bold text-wadeal-muted">
            {approvalFilter === "all"
              ? "상품 등록 버튼으로 첫 공동구매 상품을 추가해 보세요."
              : "선택한 검수 상태의 상품이 없어요."}
          </p>
          {approvalFilter === "all" ?
            <Link
              className={`${ui.btnPrimary} mx-auto mt-5 max-w-[240px] cursor-pointer`}
              href="/admin/products/new"
            >
              상품 등록
            </Link>
          : null}
        </div>
      : <div className="space-y-3">
          <p className="text-xs font-bold text-wadeal-muted">
            총 {products.length.toLocaleString("ko-KR")}개
          </p>
          {products.map((product) => (
            <article
              className="rounded-xl border border-wadeal-line bg-white p-4"
              key={product.productId}
            >
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
                      <AdminProductApprovalBadge status={product.approvalStatus} />
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-black ${statusTone(product.status)}`}
                      >
                        {adminProductStatusLabel(product.status)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-0.5 truncate text-xs font-bold text-wadeal-muted">
                    {product.slug}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold">
                    <span className="font-black text-wadeal-red">
                      {currency.format(product.groupPrice)}원
                    </span>
                    <span className="text-wadeal-muted line-through">
                      {currency.format(product.originalPrice)}원
                    </span>
                    <span className="text-wadeal-red">
                      {computeDiscountRate(product.originalPrice, product.groupPrice)}%
                    </span>
                  </div>
                </div>
              </div>

              <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
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

              <div className="mt-4 space-y-2">
                <AdminProductReviewActions product={product} />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Link
                    className={`${ui.btnOutline} h-11 cursor-pointer`}
                    href={`/admin/products/${product.productId}/edit`}
                  >
                    수정
                  </Link>
                  {product.status === "active" && product.approvalStatus === "approved" ?
                    <AdminFinalizeDealButton dealId={product.dealId} />
                  : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      }
    </div>
  );
}
