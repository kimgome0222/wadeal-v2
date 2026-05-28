"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  reviewSellerApplicationAction,
  saveSellerReviewChecksAction,
} from "@/app/actions/admin-sellers";
import type { SellerDocumentRecord, SellerReviewCheckRecord } from "@/lib/data/seller-review";
import type { SellerRecord } from "@/lib/sellers/types";
import { getSellerStatusLabel } from "@/lib/sellers/types";
import {
  SELLER_REVIEW_CHECKLIST,
  type SellerReviewCheckKey,
} from "@/lib/sellers/review-checklist";
import { ui } from "@/lib/ui";

type AdminSellerReviewFormProps = {
  seller: SellerRecord;
  documents: SellerDocumentRecord[];
  initialChecks: SellerReviewCheckRecord[];
};

export function AdminSellerReviewForm({
  seller,
  documents,
  initialChecks,
}: AdminSellerReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectedReason, setRejectedReason] = useState(seller.rejectedReason ?? "");

  const initialMap = useMemo(() => {
    const map: Partial<Record<SellerReviewCheckKey, boolean>> = {};
    for (const check of initialChecks) {
      map[check.checkKey] = check.checked;
    }
    return map;
  }, [initialChecks]);

  const [checks, setChecks] =
    useState<Partial<Record<SellerReviewCheckKey, boolean>>>(initialMap);

  function toggleCheck(key: SellerReviewCheckKey) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function saveChecks() {
    startTransition(async () => {
      await saveSellerReviewChecksAction({ sellerId: seller.id, checks });
      router.refresh();
    });
  }

  function decide(decision: "approved" | "rejected" | "under_review" | "suspended") {
    startTransition(async () => {
      await saveSellerReviewChecksAction({ sellerId: seller.id, checks });
      await reviewSellerApplicationAction({
        sellerId: seller.id,
        decision,
        rejectedReason: decision === "rejected" ? rejectedReason : undefined,
      });
      router.push("/admin/sellers");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className={`${ui.panel} space-y-3`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-wadeal-ink">{seller.companyName}</p>
            <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
              사업자번호 {seller.businessNumber}
            </p>
          </div>
          <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-muted">
            {getSellerStatusLabel(seller.status)}
          </span>
        </div>
        <dl className="grid gap-2 text-xs font-bold text-wadeal-muted sm:grid-cols-2">
          <div>
            <dt className="text-[10px] uppercase tracking-wide">대표자</dt>
            <dd className="font-black text-wadeal-ink">{seller.representativeName ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide">정산 은행</dt>
            <dd className="font-black text-wadeal-ink">{seller.bankName ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide">계좌번호</dt>
            <dd className="font-black text-wadeal-ink">{seller.accountNumber ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide">예금주</dt>
            <dd className="font-black text-wadeal-ink">{seller.accountHolder ?? "-"}</dd>
          </div>
        </dl>
        {seller.businessRegistrationUrl ?
          <a
            className="text-xs font-black text-wadeal-red underline"
            href={seller.businessRegistrationUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            사업자등록증 보기
          </a>
        : null}
      </div>

      <section className={`${ui.panel} space-y-2`}>
        <h2 className={ui.sectionTitle}>첨부 문서</h2>
        {documents.length === 0 ?
          <p className="text-xs font-bold text-wadeal-muted">
            seller_documents에 등록된 파일이 없어요. 사업자등록증 URL은 위에서 확인할 수
            있어요.
          </p>
        : documents.map((doc) => (
            <div className="flex items-center justify-between gap-2 text-xs" key={doc.id}>
              <span className="font-bold text-wadeal-muted">{doc.documentType}</span>
              <a
                className="font-black text-wadeal-red underline"
                href={doc.fileUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                열기
              </a>
            </div>
          ))
        }
      </section>

      <section className={`${ui.panel} space-y-3`}>
        <div className="flex items-center justify-between gap-2">
          <h2 className={ui.sectionTitle}>심사 체크리스트</h2>
          <button
            className={`${ui.btnOutline} h-8 px-3 text-[11px] disabled:opacity-50`}
            disabled={isPending}
            onClick={saveChecks}
            type="button"
          >
            체크 저장
          </button>
        </div>
        <ul className="space-y-2">
          {SELLER_REVIEW_CHECKLIST.map((item) => {
            const hint = item.autoHint?.(seller);

            return (
              <li className="flex items-start gap-2" key={item.key}>
                <input
                  checked={Boolean(checks[item.key])}
                  className="mt-0.5 h-4 w-4 accent-wadeal-red"
                  id={`check-${item.key}`}
                  onChange={() => toggleCheck(item.key)}
                  type="checkbox"
                />
                <label className="text-xs font-bold text-wadeal-ink" htmlFor={`check-${item.key}`}>
                  {item.label}
                  {hint ?
                    <span className="ml-1 font-bold text-wadeal-muted">({hint})</span>
                  : null}
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`${ui.panel} space-y-2`}>
        <label className="text-xs font-black text-wadeal-ink" htmlFor="rejected-reason">
          반려 사유 (반려 시)
        </label>
        <textarea
          className="min-h-[72px] w-full rounded-lg border border-wadeal-line px-3 py-2 text-xs font-bold text-wadeal-ink"
          id="rejected-reason"
          onChange={(event) => setRejectedReason(event.target.value)}
          value={rejectedReason}
        />
      </section>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          className={`${ui.btnPrimary} h-10 text-xs disabled:opacity-50`}
          disabled={isPending}
          onClick={() => decide("approved")}
          type="button"
        >
          승인
        </button>
        <button
          className={`${ui.btnOutline} h-10 text-xs disabled:opacity-50`}
          disabled={isPending}
          onClick={() => decide("under_review")}
          type="button"
        >
          보류
        </button>
        <button
          className={`${ui.btnOutline} h-10 text-xs text-wadeal-red disabled:opacity-50`}
          disabled={isPending}
          onClick={() => decide("rejected")}
          type="button"
        >
          반려
        </button>
        <button
          className={`${ui.btnOutline} h-10 text-xs disabled:opacity-50`}
          disabled={isPending}
          onClick={() => decide("suspended")}
          type="button"
        >
          정지
        </button>
      </div>

      <Link className={`${ui.btnOutline} inline-flex h-10 items-center justify-center text-xs`} href="/admin/sellers">
        목록으로
      </Link>
    </div>
  );
}
