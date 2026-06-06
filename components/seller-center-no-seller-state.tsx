import Link from "next/link";

import { EmptyState } from "@/components/empty-state";

export function SellerCenterNoSellerState() {
  return (
    <div className="space-y-4">
      <EmptyState
        actionHref="/seller/apply"
        actionLabel="판매자 신청하기"
        description="판매자 신청을 완료하면 주문·문의·리뷰 관리 기능을 사용할 수 있어요."
        title="판매자 정보가 등록되지 않았어요"
      />
      <Link
        className="block rounded-xl border border-wadeal-line bg-white px-4 py-3 text-center text-xs font-bold text-wadeal-muted hover:text-wadeal-ink"
        href="/seller/dashboard"
      >
        대시보드 mock 미리보기 →
      </Link>
    </div>
  );
}
