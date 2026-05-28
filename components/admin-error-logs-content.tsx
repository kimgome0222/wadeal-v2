"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { resolveErrorLogAction } from "@/app/actions/admin-error-logs";
import type { AdminErrorLogListItem } from "@/lib/data/admin-error-logs-shared";
import { getErrorLogRelatedHref } from "@/lib/data/admin-error-logs-shared";
import {
  ERROR_LEVELS,
  ERROR_SOURCES,
  getErrorLevelLabel,
  getErrorSourceLabel,
} from "@/lib/monitoring/error-log-shared";
import { ui } from "@/lib/ui";

type AdminErrorLogsContentProps = {
  logs: AdminErrorLogListItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  filters: {
    level?: string;
    source?: string;
    resolved?: string;
  };
};

function LevelBadge({ level, label }: { level: string; label: string }) {
  const tone =
    level === "critical" ? "bg-red-100 text-wadeal-red"
    : level === "error" ? "bg-orange-100 text-orange-800"
    : level === "warning" ? "bg-amber-100 text-amber-900"
    : "bg-gray-100 text-wadeal-ink";

  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-black ${tone}`}>
      {label}
    </span>
  );
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  const text = useMemo(() => {
    if (value === null || value === undefined) {
      return "—";
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }, [value]);

  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase text-wadeal-muted">{label}</p>
      <pre className="max-h-64 overflow-auto rounded-lg bg-gray-50 p-3 text-[10px] leading-relaxed text-wadeal-ink">
        {text}
      </pre>
    </div>
  );
}

function ErrorLogDetailPanel({
  log,
  onResolved,
}: {
  log: AdminErrorLogListItem;
  onResolved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const relatedHref = getErrorLogRelatedHref(log);

  function handleResolve() {
    setMessage(null);
    startTransition(async () => {
      const result = await resolveErrorLogAction(log.id);
      setMessage(result.message);
      if (result.success) {
        onResolved();
      }
    });
  }

  return (
    <div className="space-y-3 border-t border-gray-100 bg-gray-50/80 px-4 py-4">
      <p className="text-sm font-bold text-wadeal-ink">{log.message}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-black uppercase text-wadeal-muted">레벨 / 출처</p>
          <p className="text-xs font-bold text-wadeal-ink">
            {log.levelLabel} · {log.sourceLabel}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-wadeal-muted">발생 시각</p>
          <p className="text-xs font-bold text-wadeal-ink">{log.createdAtLabel}</p>
          <p className="font-mono text-[10px] text-wadeal-muted">{log.createdAt}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-wadeal-muted">연관 ID</p>
          <ul className="space-y-0.5 font-mono text-[10px] text-wadeal-muted">
            {log.userId ? <li>user: {log.userId}</li> : null}
            {log.orderId ? <li>order: {log.orderId}</li> : null}
            {log.paymentId ? <li>payment: {log.paymentId}</li> : null}
            {log.dealId ? <li>deal: {log.dealId}</li> : null}
            {log.productId ? <li>product: {log.productId}</li> : null}
            {!log.userId && !log.orderId && !log.paymentId && !log.dealId && !log.productId ?
              <li>—</li>
            : null}
          </ul>
          {relatedHref ?
            <Link className="mt-1 inline-block text-[10px] font-bold text-wadeal-red underline" href={relatedHref.href}>
              {relatedHref.label}
            </Link>
          : null}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-wadeal-muted">해결 상태</p>
          <p className="text-xs font-bold text-wadeal-ink">
            {log.isResolved ? `해결됨 (${log.resolvedAtLabel})` : "미해결"}
          </p>
        </div>
      </div>

      {log.stack ?
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-wadeal-muted">스택</p>
          <pre className="max-h-48 overflow-auto rounded-lg bg-gray-50 p-3 text-[10px] leading-relaxed text-wadeal-ink">
            {log.stack}
          </pre>
        </div>
      : null}

      <JsonBlock label="메타데이터 (sanitized)" value={log.metadata} />

      {!log.isResolved ?
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`${ui.btnPrimary} h-9 px-4 text-xs disabled:opacity-50`}
            disabled={pending}
            onClick={handleResolve}
            type="button"
          >
            {pending ? "처리 중…" : "해결 처리"}
          </button>
          {message ?
            <p
              className={`text-xs font-bold ${message.includes("실패") || message.includes("없") ? "text-wadeal-red" : "text-green-700"}`}
            >
              {message}
            </p>
          : null}
        </div>
      : null}
    </div>
  );
}

export function AdminErrorLogsContent({
  logs,
  totalCount,
  page,
  totalPages,
  filters,
}: AdminErrorLogsContentProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function buildPageHref(nextPage: number): string {
    const params = new URLSearchParams();
    if (filters.level) params.set("level", filters.level);
    if (filters.source) params.set("source", filters.source);
    if (filters.resolved && filters.resolved !== "open") {
      params.set("resolved", filters.resolved);
    }
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `/admin/error-logs?${query}` : "/admin/error-logs";
  }

  return (
    <div className="space-y-4">
      <form
        className={`${ui.panel} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const params = new URLSearchParams();
          const level = String(formData.get("level") ?? "").trim();
          const source = String(formData.get("source") ?? "").trim();
          const resolved = String(formData.get("resolved") ?? "").trim();
          if (level) params.set("level", level);
          if (source) params.set("source", source);
          if (resolved) params.set("resolved", resolved);
          router.push(
            params.toString() ? `/admin/error-logs?${params.toString()}` : "/admin/error-logs",
          );
        }}
      >
        <div>
          <label className={ui.label} htmlFor="level">
            레벨
          </label>
          <select className={ui.input} defaultValue={filters.level ?? ""} id="level" name="level">
            <option value="">전체</option>
            {ERROR_LEVELS.map((level) => (
              <option key={level} value={level}>
                {getErrorLevelLabel(level)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={ui.label} htmlFor="source">
            출처
          </label>
          <select className={ui.input} defaultValue={filters.source ?? ""} id="source" name="source">
            <option value="">전체</option>
            {ERROR_SOURCES.map((source) => (
              <option key={source} value={source}>
                {getErrorSourceLabel(source)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={ui.label} htmlFor="resolved">
            해결 상태
          </label>
          <select
            className={ui.input}
            defaultValue={filters.resolved ?? "open"}
            id="resolved"
            name="resolved"
          >
            <option value="open">미해결</option>
            <option value="resolved">해결됨</option>
            <option value="all">전체</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button className={`${ui.btnPrimary} h-10 px-4 text-xs`} type="submit">
            필터 적용
          </button>
          <Link className={`${ui.btnOutline} h-10 px-4 text-xs`} href="/admin/error-logs">
            초기화
          </Link>
        </div>
      </form>

      <p className="text-xs font-bold text-wadeal-muted">
        총 {totalCount.toLocaleString("ko-KR")}건 · {page}/{totalPages} 페이지
      </p>

      <div className={`${ui.panel} overflow-hidden p-0`}>
        {logs.length === 0 ?
          <p className="px-4 py-8 text-center text-sm font-bold text-wadeal-muted">
            에러 로그가 없어요.
          </p>
        : logs.map((log) => {
            const expanded = expandedId === log.id;

            return (
              <article className="border-b border-gray-100 last:border-b-0" key={log.id}>
                <button
                  className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => setExpandedId(expanded ? null : log.id)}
                  type="button"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <LevelBadge level={log.level} label={log.levelLabel} />
                      <span className="text-[10px] font-bold text-wadeal-muted">{log.sourceLabel}</span>
                      {log.isResolved ?
                        <span className="text-[10px] font-bold text-green-700">해결됨</span>
                      : <span className="text-[10px] font-bold text-wadeal-red">미해결</span>}
                    </div>
                    <p className="truncate text-xs font-bold text-wadeal-ink">{log.messagePreview}</p>
                    <p className="text-[10px] text-wadeal-muted">{log.createdAtLabel}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-black text-wadeal-muted">
                    {expanded ? "닫기" : "상세"}
                  </span>
                </button>
                {expanded ?
                  <ErrorLogDetailPanel
                    log={log}
                    onResolved={() => {
                      router.refresh();
                      setExpandedId(null);
                    }}
                  />
                : null}
              </article>
            );
          })
        }
      </div>

      {totalPages > 1 ?
        <div className="flex items-center justify-center gap-2">
          {page > 1 ?
            <Link className={`${ui.btnOutline} h-9 px-3 text-xs`} href={buildPageHref(page - 1)}>
              이전
            </Link>
          : null}
          <span className="text-xs font-bold text-wadeal-muted">
            {page} / {totalPages}
          </span>
          {page < totalPages ?
            <Link className={`${ui.btnOutline} h-9 px-3 text-xs`} href={buildPageHref(page + 1)}>
              다음
            </Link>
          : null}
        </div>
      : null}
    </div>
  );
}
