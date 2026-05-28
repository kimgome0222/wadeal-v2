"use client";

import type { OrderTimelineEntry } from "@/lib/data/order-timelines";

type OrderTimelinePanelProps = {
  entries: OrderTimelineEntry[];
};

function formatTimelineDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function OrderTimelinePanel({ entries }: OrderTimelinePanelProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border border-wadeal-line p-4">
      <p className="text-sm font-black text-wadeal-ink">주문 진행 현황</p>
      <ol className="mt-3 space-y-3">
        {entries.map((entry, index) => {
          const isLast = index === entries.length - 1;

          return (
            <li className="flex gap-3" key={entry.id}>
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-3 w-3 shrink-0 rounded-full ${
                    isLast ? "bg-wadeal-red" : "bg-gray-300"
                  }`}
                />
                {!isLast ?
                  <span className="mt-1 w-px flex-1 bg-gray-200" />
                : null}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <p className="text-xs font-black text-wadeal-ink">{entry.title}</p>
                {entry.message ?
                  <p className="mt-0.5 text-[11px] font-bold text-wadeal-muted">{entry.message}</p>
                : null}
                <p className="mt-1 text-[10px] font-bold text-gray-400">
                  {formatTimelineDate(entry.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
