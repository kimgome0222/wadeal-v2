import Link from "next/link";

import { type MypagePaginatedResult } from "@/lib/pagination/mypage";
import { ui } from "@/lib/ui";

type MypagePaginationProps = {
  basePath: string;
  pagination: Pick<MypagePaginatedResult<unknown>, "page" | "total" | "totalPages">;
  extraParams?: Record<string, string>;
};

function buildPageHref(
  basePath: string,
  page: number,
  extraParams?: Record<string, string>,
): string {
  const params = new URLSearchParams(extraParams);

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function MypagePagination({
  basePath,
  pagination,
  extraParams,
}: MypagePaginationProps) {
  const { page, total, totalPages } = pagination;

  if (total === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="space-y-2 pt-1">
      <p className="text-center text-xs font-bold text-wadeal-muted">
        총 {total.toLocaleString("ko-KR")}건 · {page}/{totalPages} 페이지
      </p>
      <div className="flex items-center justify-center gap-2">
        {page > 1 ?
          <Link
            className={`${ui.btnOutline} h-9 max-w-[120px] px-3 text-xs`}
            href={buildPageHref(basePath, page - 1, extraParams)}
          >
            이전
          </Link>
        : null}
        {page < totalPages ?
          <Link
            className={`${ui.btnOutline} h-9 max-w-[120px] px-3 text-xs`}
            href={buildPageHref(basePath, page + 1, extraParams)}
          >
            다음
          </Link>
        : null}
      </div>
    </div>
  );
}
