import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ui } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className={`${ui.pageWrap} min-h-screen pb-24 shadow-soft`}>
      <div className={`${ui.pageBody} pt-16`}>
        <p className="mb-4 text-center text-sm font-black text-wadeal-red">celloh</p>
        <EmptyState
          actionHref="/"
          actionLabel="홈으로 가기"
          description="주소를 다시 확인하거나 홈에서 판매자와 상품을 찾아보세요."
          title="페이지를 찾을 수 없어요"
        />
        <p className="mt-6 text-center text-xs font-bold text-wadeal-muted">
          <Link className="text-wadeal-red active:opacity-80" href="/search">
            상품·판매자 검색하기
          </Link>
        </p>
      </div>
    </main>
  );
}
