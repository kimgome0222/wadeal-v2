"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
  getAdminActionLabel,
  getAdminTargetHref,
  getAdminTargetTypeLabel,
} from "@/lib/admin/activity-log-shared";
import type {
  AdminActivityLogAdminOption,
  AdminActivityLogListItem,
} from "@/lib/data/admin-activity-logs-shared";
import { ui } from "@/lib/ui";

type AdminActivityLogsContentProps = {
  logs: AdminActivityLogListItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  adminOptions: AdminActivityLogAdminOption[];
  filters: {
    adminId?: string;
    action?: string;
    targetType?: string;
    from?: string;
    to?: string;
  };
};

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

function LogDetailPanel({ log }: { log: AdminActivityLogListItem }) {
  const targetHref = getAdminTargetHref(log.targetType, log.targetId);

  return (
    <div className="space-y-3 border-t border-gray-100 bg-gray-50/80 px-4 py-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-black uppercase text-wadeal-muted">관리자</p>
          <p className="text-xs font-bold text-wadeal-ink">{log.adminName}</p>
          {log.adminEmail ?
            <p className="text-[10px] text-wadeal-muted">{log.adminEmail}</p>
          : null}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-wadeal-muted">시각</p>
          <p className="text-xs font-bold text-wadeal-ink">{log.createdAtLabel}</p>
          <p className="font-mono text-[10px] text-wadeal-muted">{log.createdAt}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-wadeal-muted">대상</p>
          <p className="text-xs font-bold text-wadeal-ink">
            {log.targetTypeLabel} · {log.targetId}
          </p>
          {targetHref ?
            <Link className="text-[10px] font-bold text-wadeal-red underline" href={targetHref}>
              대상 페이지 열기
            </Link>
          : null}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-wadeal-muted">접속 정보</p>
          <p className="text-[10px] text-wadeal-muted">
            IP 해시: {log.ipHash ? `${log.ipHash.slice(0, 12)}…` : "—"}
          </p>
          <p className="truncate text-[10px] text-wadeal-muted">
            UA: {log.userAgent ?? "—"}
          </p>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <JsonBlock label="변경 전 (before_data)" value={log.beforeData} />
        <JsonBlock label="변경 후 (after_data)" value={log.afterData} />
      </div>
    </div>
  );
}

export function AdminActivityLogsContent({
  logs,
  totalCount,
  page,
  totalPages,
  adminOptions,
  filters,
}: AdminActivityLogsContentProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function buildPageHref(nextPage: number): string {
    const params = new URLSearchParams();
    if (filters.adminId) params.set("admin_id", filters.adminId);
    if (filters.action) params.set("action", filters.action);
    if (filters.targetType) params.set("target_type", filters.targetType);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `/admin/activity-logs?${query}` : "/admin/activity-logs";
  }

  return (
    <div className="space-y-4">
      <form
        className={`${ui.panel} grid gap-3 sm:grid-cols-2 lg:grid-cols-5`}
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const params = new URLSearchParams();
          const adminId = String(formData.get("admin_id") ?? "").trim();
          const action = String(formData.get("action") ?? "").trim();
          const targetType = String(formData.get("target_type") ?? "").trim();
          const from = String(formData.get("from") ?? "").trim();
          const to = String(formData.get("to") ?? "").trim();
          if (adminId) params.set("admin_id", adminId);
          if (action) params.set("action", action);
          if (targetType) params.set("target_type", targetType);
          if (from) params.set("from", from);
          if (to) params.set("to", to);
          router.push(
            params.toString() ? `/admin/activity-logs?${params.toString()}` : "/admin/activity-logs",
          );
        }}
      >
        <div>
          <label className={ui.label} htmlFor="admin_id">
            관리자
          </label>
          <select
            className={ui.input}
            defaultValue={filters.adminId ?? ""}
            id="admin_id"
            name="admin_id"
          >
            <option value="">전체</option>
            {adminOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={ui.label} htmlFor="action">
            액션
          </label>
          <select className={ui.input} defaultValue={filters.action ?? ""} id="action" name="action">
            <option value="">전체</option>
            {Object.values(ADMIN_ACTIONS).map((action) => (
              <option key={action} value={action}>
                {getAdminActionLabel(action)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={ui.label} htmlFor="target_type">
            대상 유형
          </label>
          <select
            className={ui.input}
            defaultValue={filters.targetType ?? ""}
            id="target_type"
            name="target_type"
          >
            <option value="">전체</option>
            {Object.values(ADMIN_TARGET_TYPES).map((targetType) => (
              <option key={targetType} value={targetType}>
                {getAdminTargetTypeLabel(targetType)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={ui.label} htmlFor="from">
            시작일
          </label>
          <input
            className={ui.input}
            defaultValue={filters.from ?? ""}
            id="from"
            name="from"
            type="date"
          />
        </div>
        <div>
          <label className={ui.label} htmlFor="to">
            종료일
          </label>
          <input
            className={ui.input}
            defaultValue={filters.to ?? ""}
            id="to"
            name="to"
            type="date"
          />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-5">
          <button className={`${ui.btnPrimary} h-10 px-4 text-xs`} type="submit">
            필터 적용
          </button>
          <Link className={`${ui.btnOutline} h-10 px-4 text-xs`} href="/admin/activity-logs">
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
            활동 로그가 없어요.
          </p>
        : logs.map((log) => {
            const expanded = expandedId === log.id;
            const targetHref = getAdminTargetHref(log.targetType, log.targetId);

            return (
              <article className="border-b border-gray-100 last:border-b-0" key={log.id}>
                <button
                  className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => setExpandedId(expanded ? null : log.id)}
                  type="button"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-black text-wadeal-ink">{log.actionLabel}</p>
                    <p className="text-[10px] text-wadeal-muted">
                      {log.adminName} · {log.createdAtLabel}
                    </p>
                    <p className="truncate text-[10px] text-wadeal-muted">
                      {log.targetTypeLabel} · {log.targetId}
                    </p>
                  </div>
                  <div className="shrink-0 space-y-1 text-right">
                    {targetHref ?
                      <Link
                        className="block text-[10px] font-bold text-wadeal-red underline"
                        href={targetHref}
                        onClick={(event) => event.stopPropagation()}
                      >
                        대상
                      </Link>
                    : null}
                    <span className="block text-[10px] font-black text-wadeal-muted">
                      {expanded ? "닫기" : "상세"}
                    </span>
                  </div>
                </button>
                {expanded ? <LogDetailPanel log={log} /> : null}
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
