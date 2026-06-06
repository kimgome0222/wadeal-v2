"use client";

import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ui } from "@/lib/ui";

export default function CategoryNotFound() {
  return (
    <main className={`${ui.pageWrap} min-h-screen bg-white pb-24`}>
      <div className={`${ui.pageBody} pt-16`}>
        <EmptyState
          actionHref="/categories"
          actionLabel="카테고리 목록"
          description="주소를 다시 확인하거나 다른 카테고리를 둘러보세요."
          title="카테고리를 찾을 수 없어요"
          variant="search"
        />
        <div className="mt-4 flex flex-col gap-2">
          <Link className={`${ui.btnOutline} min-h-[44px]`} href="/">
            홈으로 가기
          </Link>
          <Link className={`${ui.btnOutline} min-h-[44px]`} href="/support">
            고객센터
          </Link>
        </div>
      </div>
    </main>
  );
}
