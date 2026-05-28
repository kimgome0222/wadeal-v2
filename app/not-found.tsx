import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ui } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className={`${ui.pageWrap} min-h-screen pb-24 shadow-soft`}>
      <div className={`${ui.pageBody} pt-16`}>
        <EmptyState
          actionHref="/"
          actionLabel="홈으로 가기"
          description="주소를 다시 확인하거나 홈에서 다른 공동구매를 찾아보세요."
          title="페이지를 찾을 수 없어요"
        />
        <p className="mt-6 text-center text-xs font-bold text-wadeal-muted">
          <Link className="text-wadeal-red active:opacity-80" href="/search">
            상품 검색하기
          </Link>
        </p>
      </div>
    </main>
  );
}
