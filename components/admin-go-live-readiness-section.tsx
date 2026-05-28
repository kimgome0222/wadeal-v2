import Link from "next/link";

import type {
  GoLiveReadinessResult,
  ReadinessItem,
  ReadinessStatus,
} from "@/lib/admin/go-live-readiness";
import { ui } from "@/lib/ui";

type AdminGoLiveReadinessSectionProps = {
  readiness: GoLiveReadinessResult;
  showFullLink?: boolean;
};

const STATUS_LABELS: Record<ReadinessStatus, string> = {
  ready: "완료",
  warning: "주의",
  missing: "미완료",
};

const STATUS_BADGE_CLASS: Record<ReadinessStatus, string> = {
  ready: "bg-green-50 text-green-800",
  warning: "bg-amber-50 text-amber-800",
  missing: "bg-red-50 text-wadeal-red",
};

const STATUS_DOT_CLASS: Record<ReadinessStatus, string> = {
  ready: "bg-green-500",
  warning: "bg-amber-500",
  missing: "bg-wadeal-red",
};

function ReadinessBadge({ status }: { status: ReadinessStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-black ${STATUS_BADGE_CLASS[status]}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_CLASS[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}

function ReadinessRow({ item }: { item: ReadinessItem }) {
  const content = (
    <div className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-black text-wadeal-ink">{item.label}</p>
        <p className="text-[11px] font-bold leading-relaxed text-wadeal-muted">{item.message}</p>
      </div>
      <ReadinessBadge status={item.status} />
    </div>
  );

  if (item.detailUrl) {
    return (
      <Link className="block transition-opacity hover:opacity-80" href={item.detailUrl}>
        {content}
      </Link>
    );
  }

  return content;
}

export function AdminGoLiveReadinessSection({
  readiness,
  showFullLink = true,
}: AdminGoLiveReadinessSectionProps) {
  const { summary } = readiness;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className={ui.sectionTitle}>오픈 준비 상태</h2>
        {showFullLink ?
          <Link className="text-[11px] font-black text-wadeal-red" href="/admin/go-live-readiness">
            전체 보기
          </Link>
        : null}
      </div>

      <div className={`${ui.panel} space-y-3`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-black text-wadeal-ink">전체 진행률</span>
            <span className="text-xs font-black text-wadeal-muted">
              {summary.ready}/{summary.total} 완료 ({summary.progressPercent}%)
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${summary.progressPercent}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold text-wadeal-muted">
            <span className="text-green-700">완료 {summary.ready}</span>
            <span className="text-amber-700">주의 {summary.warning}</span>
            <span className="text-wadeal-red">미완료 {summary.missing}</span>
          </div>
        </div>

        <div className={`${ui.listDivider}`}>
          {readiness.items.map((item) => (
            <ReadinessRow item={item} key={item.id} />
          ))}
        </div>

        <p className="text-[10px] font-bold text-wadeal-muted">
          마지막 확인:{" "}
          {new Date(readiness.checkedAt).toLocaleString("ko-KR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>
    </section>
  );
}
