"use client";

import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className={`${ui.pageWrap} min-h-screen pb-24 bg-white shadow-soft`}>
      <div className={`${ui.pageBody} pt-16`}>
        <EmptyState
          actionHref="/"
          actionLabel="홈으로 가기"
          description="주소를 다시 확인하거나 홈에서 판매자와 상품을 찾아보세요."
          title="페이지를 찾을 수 없어요"
          variant="search"
        />
        <div className="mt-4 flex flex-col gap-2">
          <Link className={`${ui.btnOutline} min-h-[44px]`} href="/collections/recommended">
            추천상품 보기
          </Link>
          <Link className={`${ui.btnOutline} min-h-[44px]`} href="/join-cart">
            장바구니
          </Link>
          <Link className={`${ui.btnOutline} min-h-[44px]`} href="/support">
            고객센터
          </Link>
          <Link
            className={`${ui.btnOutline} min-h-[44px]`}
            href="/search"
          >
            상품·판매자 검색하기
          </Link>
          <button
            className={`${ds.btn.ghost} min-h-[44px] w-full`}
            onClick={() => window.history.back()}
            type="button"
          >
            이전 페이지
          </button>
        </div>
      </div>
    </main>
  );
}
