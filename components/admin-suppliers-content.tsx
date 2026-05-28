"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateAdminSupplierStatusAction } from "@/app/actions/admin-suppliers";
import {
  formatCommissionRate,
  getSupplierStatusLabel,
  type AdminSupplierListItem,
} from "@/lib/admin-suppliers/shared";
import { supplierStatusTone, type SupplierStatus } from "@/lib/settlements/labels";
import { ui } from "@/lib/ui";

type AdminSuppliersContentProps = {
  suppliers: AdminSupplierListItem[];
};

const statusActions: Array<{ status: SupplierStatus; label: string }> = [
  { status: "active", label: "활성" },
  { status: "paused", label: "일시중지" },
  { status: "terminated", label: "종료" },
];

export function AdminSuppliersContent({ suppliers }: AdminSuppliersContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function handleStatusChange(supplierId: string, status: SupplierStatus) {
    setFeedback(null);

    startTransition(async () => {
      const result = await updateAdminSupplierStatusAction(supplierId, status);

      if (result.success) {
        setFeedback({ tone: "success", message: "상태가 변경됐어요." });
        router.refresh();
        return;
      }

      setFeedback({ tone: "error", message: "상태 변경에 실패했어요." });
    });
  }

  if (suppliers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
        <p className="text-sm font-black text-wadeal-ink">등록된 공급사가 없어요.</p>
        <p className="mt-1 text-xs font-bold text-wadeal-muted">
          공급사 등록 버튼으로 첫 공급사를 추가해 보세요.
        </p>
        <Link
          className={`${ui.btnPrimary} mx-auto mt-5 max-w-[240px] cursor-pointer`}
          href="/admin/suppliers/new"
        >
          공급사 등록
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      <p className="text-xs font-bold text-wadeal-muted">
        총 {suppliers.length.toLocaleString("ko-KR")}개
      </p>

      {suppliers.map((supplier) => (
        <article
          className="rounded-xl border border-wadeal-line bg-white p-4"
          key={supplier.id}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-wadeal-ink">{supplier.name}</p>
              {supplier.businessNumber ?
                <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
                  사업자번호 {supplier.businessNumber}
                </p>
              : null}
            </div>
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-black ${supplierStatusTone(supplier.status)}`}
            >
              {getSupplierStatusLabel(supplier.status)}
            </span>
          </div>

          <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>담당자</dt>
              <dd className="font-black text-wadeal-ink">{supplier.contactName ?? "-"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>연락처</dt>
              <dd className="font-black text-wadeal-ink">{supplier.phone ?? "-"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>수수료율</dt>
              <dd className="font-black text-wadeal-ink">
                {formatCommissionRate(supplier.commissionRate)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>연결 상품</dt>
              <dd className="font-black text-wadeal-ink">
                {supplier.productCount.toLocaleString("ko-KR")}개
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              className={`${ui.btnOutline} h-9 flex-1 cursor-pointer text-xs`}
              href={`/admin/suppliers/${supplier.id}/edit`}
            >
              수정
            </Link>
            {statusActions
              .filter((action) => action.status !== supplier.status)
              .map((action) => (
                <button
                  className={`${ui.btnOutline} h-9 flex-1 cursor-pointer text-xs disabled:opacity-50`}
                  disabled={isPending}
                  key={action.status}
                  onClick={() => handleStatusChange(supplier.id, action.status)}
                  type="button"
                >
                  {action.label}
                </button>
              ))}
          </div>
        </article>
      ))}
    </div>
  );
}
