import Link from "next/link";

import { SUPPORT_NOTICES } from "@/lib/support/mock-customer-support-data";
import { ui } from "@/lib/ui";

export function SupportNoticesMockList() {
  return (
    <ul className="divide-y divide-wadeal-line overflow-hidden rounded-2xl border border-wadeal-line bg-white">
      {SUPPORT_NOTICES.map((notice) => (
        <li key={notice.id}>
          <Link
            className="flex items-start justify-between gap-3 px-4 py-4 hover:bg-wadeal-surface"
            href={`/support/notices/${notice.id}`}
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-wadeal-surface px-2 py-0.5 text-[10px] font-bold text-wadeal-muted">
                  {notice.category}
                </span>
                {notice.important ?
                  <span className="rounded bg-wadeal-red/10 px-2 py-0.5 text-[10px] font-black text-wadeal-red">
                    중요
                  </span>
                : null}
              </div>
              <p className="text-sm font-semibold text-wadeal-ink">{notice.title}</p>
              <p className="text-[11px] font-medium text-wadeal-muted">{notice.date}</p>
            </div>
            <span aria-hidden className="shrink-0 text-wadeal-muted">
              ›
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

type SupportNoticeDetailProps = {
  notice: (typeof SUPPORT_NOTICES)[number];
};

export function SupportNoticeDetail({ notice }: SupportNoticeDetailProps) {
  return (
    <article className={`${ui.panel} space-y-4`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-wadeal-surface px-2 py-0.5 text-[10px] font-bold text-wadeal-muted">
          {notice.category}
        </span>
        {notice.important ?
          <span className="rounded bg-wadeal-red/10 px-2 py-0.5 text-[10px] font-black text-wadeal-red">
            중요
          </span>
        : null}
        <span className="text-[11px] font-medium text-wadeal-muted">{notice.date}</span>
      </div>
      <h1 className="text-lg font-black text-wadeal-ink">{notice.title}</h1>
      <p className="text-sm font-medium leading-relaxed text-wadeal-muted">{notice.content}</p>
    </article>
  );
}
