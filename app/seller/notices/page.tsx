import Link from "next/link";
import { Suspense } from "react";

import { SellerNoticesFilter } from "@/components/seller-notices-filter";
import { SellerShell } from "@/components/seller-shell";
import { requireSeller } from "@/lib/auth/require-seller";
import { getPublishedSellerNotices } from "@/lib/data/seller-notices";
import { isSellerNoticeCategory } from "@/lib/sellers/notice-types";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerNoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  await requireSeller();
  const params = await searchParams;
  const category =
    params.category && isSellerNoticeCategory(params.category) ? params.category : "all";
  const notices = await getPublishedSellerNotices({
    category,
    query: params.q,
  });

  return (
    <SellerShell title="공지사항">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Link className={`${ui.btnOutline} h-9 px-3 text-xs`} href="/seller/policies">
            운영정책
          </Link>
          <Link className={`${ui.btnOutline} h-9 px-3 text-xs`} href="/seller/resources">
            자료실
          </Link>
        </div>
        <Suspense fallback={null}>
          <SellerNoticesFilter current={category} />
        </Suspense>
        {notices.length === 0 ?
          <div className={`${ui.panel} py-10 text-center text-sm font-bold text-wadeal-muted`}>
            공지가 없어요.
          </div>
        : notices.map((notice) => (
            <Link
              className={`${ui.panel} block space-y-2`}
              href={`/seller/notices/${notice.id}`}
              key={notice.id}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-black text-wadeal-ink">
                  {notice.isImportant ?
                    <span className="mr-1 text-wadeal-red">[중요]</span>
                  : null}
                  {notice.title}
                </p>
                <span className="text-[10px] font-bold text-wadeal-muted">{notice.categoryLabel}</span>
              </div>
              <p className="text-xs font-bold text-wadeal-muted">
                {notice.publishedAt ?
                  new Date(notice.publishedAt).toLocaleDateString("ko-KR")
                : new Date(notice.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </Link>
          ))
        }
      </div>
    </SellerShell>
  );
}
