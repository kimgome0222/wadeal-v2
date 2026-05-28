import Link from "next/link";

import type {
  MvpReadinessItem,
  MvpReadinessResult,
  MvpReadinessStatus,
} from "@/lib/admin/mvp-readiness";
import { ui } from "@/lib/ui";

type AdminMvpReadinessSectionProps = {
  readiness: MvpReadinessResult;
};

const STATUS_LABELS: Record<MvpReadinessStatus, string> = {
  ready: "완료",
  partial: "부분",
  missing: "미완료",
  risk: "리스크",
};

const STATUS_BADGE_CLASS: Record<MvpReadinessStatus, string> = {
  ready: "bg-green-50 text-green-800",
  partial: "bg-amber-50 text-amber-800",
  missing: "bg-red-50 text-wadeal-red",
  risk: "bg-red-50 text-wadeal-red",
};

const STATUS_DOT_CLASS: Record<MvpReadinessStatus, string> = {
  ready: "bg-green-500",
  partial: "bg-amber-500",
  missing: "bg-wadeal-red",
  risk: "bg-wadeal-red",
};

function ReadinessBadge({ status }: { status: MvpReadinessStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-black ${STATUS_BADGE_CLASS[status]}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_CLASS[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}

function ReadinessRow({ item }: { item: MvpReadinessItem }) {
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

export function AdminMvpReadinessSection({ readiness }: AdminMvpReadinessSectionProps) {
  const { summary, items } = readiness;

  const mvpItems = items.filter((item) => item.category === "mvp");
  const incompleteItems = mvpItems.filter(
    (item) => item.status === "partial" || item.status === "missing",
  );
  const launchRiskItems = items.filter(
    (item) =>
      item.status === "risk" ||
      item.category === "risk" ||
      item.category === "deferred" ||
      (item.risk === "high" && item.status !== "ready"),
  );

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className={ui.sectionTitle}>MVP 출시 준비</h2>
        <span className="text-[11px] font-bold text-wadeal-muted">docs/MVP_SCOPE.md</span>
      </div>

      <div className={`${ui.panel} space-y-3`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-black text-wadeal-ink">필수 기능 진행률</span>
            <span className="text-xs font-black text-wadeal-muted">
              {summary.mvpReady}/{summary.mvpTotal} 완료 ({summary.mvpProgressPercent}%)
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${summary.mvpProgressPercent}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold text-wadeal-muted">
            <span className="text-green-700">완료 {summary.mvpReady}</span>
            <span className="text-amber-700">부분 {summary.mvpPartial}</span>
            <span className="text-wadeal-red">미완료 {summary.mvpMissing}</span>
            {summary.mvpRisk > 0 ?
              <span className="text-wadeal-red">리스크 {summary.mvpRisk}</span>
            : null}
          </div>
        </div>

        {incompleteItems.length > 0 ?
          <div className="space-y-1">
            <p className="text-xs font-black text-wadeal-ink">미완료·부분 완료 ({incompleteItems.length})</p>
            <div className={ui.listDivider}>
              {incompleteItems.map((item) => (
                <ReadinessRow item={item} key={item.id} />
              ))}
            </div>
          </div>
        : <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-800">
            MVP 필수 항목이 모두 완료 상태입니다.
          </p>
        }

        {launchRiskItems.length > 0 ?
          <div className="space-y-1">
            <p className="text-xs font-black text-wadeal-red">
              출시 리스크·주의 ({summary.launchRiskCount})
            </p>
            <div className={ui.listDivider}>
              {launchRiskItems.map((item) => (
                <ReadinessRow item={item} key={`risk-${item.id}`} />
              ))}
            </div>
          </div>
        : null}

        <details className="text-[11px] font-bold text-wadeal-muted">
          <summary className="cursor-pointer text-wadeal-ink">전체 MVP·베타 이후 항목 보기</summary>
          <div className={`${ui.listDivider} mt-2`}>
            {items.map((item) => (
              <ReadinessRow item={item} key={item.id} />
            ))}
          </div>
        </details>

        <p className="text-[10px] font-bold text-wadeal-muted">
          마지막 확인:{" "}
          {new Date(readiness.checkedAt).toLocaleString("ko-KR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
          {" · "}
          docs/RELEASE_PLAN.md
        </p>
      </div>
    </section>
  );
}
