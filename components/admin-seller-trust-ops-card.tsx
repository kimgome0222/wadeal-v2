import Link from "next/link";

import { ui } from "@/lib/ui";

const OPS_LINKS = [
  {
    label: "인증 판매자 관리",
    href: "/admin/sellers",
    todo: "sellers.status 승인/반려",
  },
  {
    label: "판매자 리뷰 관리",
    href: "/admin/reviews",
    todo: "seller_reviews 테이블 (예정)",
  },
  {
    label: "판매자 신뢰 지표 관리",
    href: "/admin/sellers",
    todo: "seller_stats 집계/보정",
  },
  {
    label: "추천 판매자 상품 관리",
    href: "/admin/products",
    todo: "추천 알고리즘·수동 큐레이션",
  },
] as const;

/**
 * 관리자센터 — 판매자 신뢰/추천 운영 안내 카드 (기존 라우트 재사용).
 * TODO: 전용 운영 화면 추가 시 href 분리.
 */
export function AdminSellerTrustOpsCard() {
  return (
    <section className={`${ui.panel} space-y-3`}>
      <div>
        <p className="text-sm font-black text-wadeal-ink">판매자 신뢰 · 추천 운영</p>
        <p className="mt-1 text-xs font-medium text-wadeal-muted">
          celloh 판매자 중심 운영을 위한 관리 항목입니다. (UI 안내 · 추후 API 연동)
        </p>
      </div>
      <ul className="space-y-2">
        {OPS_LINKS.map((item) => (
          <li key={item.label}>
            <Link
              className="celloh-transition flex items-center justify-between rounded-xl border border-wadeal-line bg-white px-3 py-2.5 hover:-translate-y-0.5 hover:shadow-card"
              href={item.href}
            >
              <span className="text-xs font-bold text-wadeal-ink">{item.label}</span>
              <span aria-hidden className="text-wadeal-muted">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
