import type {
  MigrationApplyStatus,
  MigrationStatusResult,
} from "@/lib/admin/migration-status";
import { ui } from "@/lib/ui";

type AdminMigrationsStatusSectionProps = {
  status: MigrationStatusResult;
};

const STATUS_LABELS: Record<MigrationApplyStatus, string> = {
  applied: "적용됨",
  missing: "미적용",
  partial: "일부",
  unknown: "미확인",
};

const STATUS_BADGE_CLASS: Record<MigrationApplyStatus, string> = {
  applied: "bg-green-50 text-green-800",
  missing: "bg-red-50 text-wadeal-red",
  partial: "bg-amber-50 text-amber-800",
  unknown: "bg-gray-100 text-wadeal-muted",
};

function StatusBadge({ status }: { status: MigrationApplyStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded px-2 py-0.5 text-[10px] font-black ${STATUS_BADGE_CLASS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function targetLabel(kind: string, name: string): string {
  if (kind === "column") {
    return `column ${name}`;
  }
  if (kind === "storage_bucket") {
    return `bucket ${name}`;
  }
  if (kind === "view") {
    return `view ${name}`;
  }
  return `table ${name}`;
}

export function AdminMigrationsStatusSection({
  status,
}: AdminMigrationsStatusSectionProps) {
  const { summary } = status;

  return (
    <section className="space-y-4">
      <div className={`${ui.panel} space-y-3`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className={ui.sectionTitle}>Migration 적용 상태</h2>
          <p className="text-[10px] font-bold text-wadeal-muted">
            {new Date(status.checkedAt).toLocaleString("ko-KR")} · probe:{" "}
            {status.probeMode}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-lg bg-green-50 px-3 py-2 text-center">
            <p className="text-lg font-black text-green-800">{summary.applied}</p>
            <p className="text-[10px] font-bold text-green-700">적용됨</p>
          </div>
          <div className="rounded-lg bg-red-50 px-3 py-2 text-center">
            <p className="text-lg font-black text-wadeal-red">{summary.missing}</p>
            <p className="text-[10px] font-bold text-wadeal-red">미적용</p>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-center">
            <p className="text-lg font-black text-amber-800">{summary.partial}</p>
            <p className="text-[10px] font-bold text-amber-700">일부</p>
          </div>
          <div className="rounded-lg bg-gray-100 px-3 py-2 text-center">
            <p className="text-lg font-black text-wadeal-muted">{summary.unknown}</p>
            <p className="text-[10px] font-bold text-wadeal-muted">미확인</p>
          </div>
        </div>

        {!status.supabaseConfigured ?
          <p className="text-[11px] font-bold text-wadeal-red">
            Supabase URL/키가 설정되지 않아 원격 DB를 조회할 수 없습니다.
          </p>
        : null}
      </div>

      <div className={`${ui.panel} divide-y divide-wadeal-border p-4`}>
        {status.items.map((item) => (
          <article className="space-y-2 py-3 first:pt-0 last:pb-0" key={item.definition.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-black text-wadeal-ink">
                  {item.definition.id} · {item.definition.label}
                </p>
                <p className="font-mono text-[10px] text-wadeal-muted">
                  supabase/migrations/{item.definition.filename}
                </p>
                <p className="text-[11px] font-bold text-wadeal-muted">
                  {item.definition.description}
                </p>
                <p className="text-[11px] font-bold text-wadeal-ink">{item.message}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <ul className="space-y-1 pl-1">
              {item.targetResults.map((result) => (
                <li
                  className="flex items-center justify-between gap-2 text-[10px] font-bold"
                  key={`${result.target.kind}-${result.target.name}`}
                >
                  <span className="text-wadeal-muted">
                    {targetLabel(result.target.kind, result.target.name)}
                  </span>
                  <span className={result.ok ? "text-green-700" : "text-wadeal-red"}>
                    {result.message}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className={`${ui.panel} space-y-2 p-4`}>
        <h3 className="text-xs font-black text-wadeal-ink">Supabase SQL Editor 실행 순서</h3>
        <ol className="list-decimal space-y-1 pl-4 text-[11px] font-bold text-wadeal-muted">
          {status.items.map((item) => (
            <li key={item.definition.id}>
              <span className="font-mono">{item.definition.filename}</span>
              {item.status === "applied" ?
                <span className="ml-1 text-green-700">(적용됨)</span>
              : null}
            </li>
          ))}
        </ol>
        <p className="text-[10px] font-bold leading-relaxed text-wadeal-muted">
          파일은 Supabase Dashboard → SQL Editor에서 위 순서대로 실행하세요. 이미 적용된
          migration은 IF NOT EXISTS / ON CONFLICT로 안전하게 재실행 가능합니다.
        </p>
      </div>
    </section>
  );
}
