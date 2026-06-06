import Link from "next/link";

import { ui } from "@/lib/ui";

type AdminReviewGuidesPanelProps = {
  variant: "product" | "seller";
};

/** Admin 검수 기준 문서·정책 링크 — repo docs + live policy routes */
export function AdminReviewGuidesPanel({ variant }: AdminReviewGuidesPanelProps) {
  const isProduct = variant === "product";

  return (
    <section className={`${ui.panel} space-y-3`}>
      <h2 className="text-sm font-bold text-wadeal-ink">검수 기준 안내</h2>
      <p className="text-[11px] font-medium leading-relaxed text-wadeal-muted">
        승인·반려 전 아래 기준을 확인하세요. 상세 체크리스트는 저장소{" "}
        <code className="font-mono text-[10px]">docs/</code> 문서를 참고합니다.
      </p>
      <div className="flex flex-wrap gap-2">
        {isProduct ?
          <>
            <Link
              className="rounded-full border border-wadeal-line bg-white px-3 py-1.5 text-[11px] font-semibold text-wadeal-ink hover:bg-wadeal-surface"
              href="/admin/product-requests"
            >
              상품 승인센터
            </Link>
            <Link
              className="rounded-full border border-wadeal-line bg-white px-3 py-1.5 text-[11px] font-semibold text-wadeal-ink hover:bg-wadeal-surface"
              href="/policies/refund"
            >
              환불/교환 정책
            </Link>
            <Link
              className="rounded-full border border-wadeal-line bg-white px-3 py-1.5 text-[11px] font-semibold text-wadeal-ink hover:bg-wadeal-surface"
              href="/policies/shipping"
            >
              배송 정책
            </Link>
          </>
        : <>
            <Link
              className="rounded-full border border-wadeal-line bg-white px-3 py-1.5 text-[11px] font-semibold text-wadeal-ink hover:bg-wadeal-surface"
              href="/policies/seller"
            >
              판매자 운영 정책
            </Link>
            <Link
              className="rounded-full border border-wadeal-line bg-white px-3 py-1.5 text-[11px] font-semibold text-wadeal-ink hover:bg-wadeal-surface"
              href="/admin/settings/business"
            >
              사업자 정보 설정
            </Link>
          </>
        }
        <Link
          className="rounded-full border border-wadeal-line bg-white px-3 py-1.5 text-[11px] font-semibold text-wadeal-ink hover:bg-wadeal-surface"
          href="/info/ranking-policy"
        >
          랭킹·표시 정책
        </Link>
      </div>
      <ul className="space-y-1 text-[11px] font-medium text-wadeal-muted">
        {isProduct ?
          <>
            <li>
              · <code className="font-mono">docs/CELLOH_PRODUCT_REVIEW_CHECKLIST.md</code>
            </li>
            <li>
              · <code className="font-mono">docs/CELLOH_REJECTION_REASON_TEMPLATES.md</code> (상품)
            </li>
            <li>
              · <code className="font-mono">docs/CELLOH_STATUS_VALUES.md</code> — 상품 lifecycle
            </li>
            <li>
              · Code: <code className="font-mono">lib/products/review-checklist.ts</code>
            </li>
          </>
        : <>
            <li>
              · <code className="font-mono">docs/CELLOH_SELLER_REVIEW_CHECKLIST.md</code>
            </li>
            <li>
              · <code className="font-mono">docs/CELLOH_REJECTION_REASON_TEMPLATES.md</code> (판매자)
            </li>
            <li>
              · <code className="font-mono">docs/CELLOH_STATUS_VALUES.md</code> — seller lifecycle
            </li>
            <li>
              · Code: <code className="font-mono">lib/sellers/review-checklist.ts</code>
            </li>
          </>
        }
      </ul>
    </section>
  );
}
