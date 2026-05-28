import Link from "next/link";
import { notFound } from "next/navigation";

import { SellerShell } from "@/components/seller-shell";
import { requireSeller } from "@/lib/auth/require-seller";
import { getPublishedSellerNoticeById } from "@/lib/data/seller-notices";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerNoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSeller();
  const { id } = await params;
  const notice = await getPublishedSellerNoticeById(id);

  if (!notice) {
    notFound();
  }

  return (
    <SellerShell title="공지 상세">
      <div className="space-y-4">
        <Link className="text-xs font-black text-wadeal-red" href="/seller/notices">
          ← 공지 목록
        </Link>
        <div className={`${ui.panel} space-y-3`}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-black text-wadeal-ink">
              {notice.isImportant ?
                <span className="mr-1 text-wadeal-red">[중요]</span>
              : null}
              {notice.title}
            </h2>
            <span className="text-[10px] font-bold text-wadeal-muted">{notice.categoryLabel}</span>
          </div>
          <p className="text-[11px] font-bold text-wadeal-muted">
            {notice.publishedAt ?
              new Date(notice.publishedAt).toLocaleString("ko-KR")
            : new Date(notice.createdAt).toLocaleString("ko-KR")}
          </p>
          <p className="whitespace-pre-wrap text-sm font-bold leading-relaxed text-wadeal-ink">
            {notice.content}
          </p>
          {notice.attachmentUrls.length > 0 ?
            <div className="space-y-1">
              <p className="text-xs font-black text-wadeal-muted">첨부</p>
              {notice.attachmentUrls.map((url) => (
                <a
                  className="block text-xs font-bold text-wadeal-red underline"
                  href={url}
                  key={url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {url}
                </a>
              ))}
            </div>
          : null}
        </div>
      </div>
    </SellerShell>
  );
}
