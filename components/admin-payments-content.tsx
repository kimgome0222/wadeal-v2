"use client";

import type { AdminPaymentLogItem, AdminWebhookLogItem } from "@/lib/data/admin-payments";
import { ui } from "@/lib/ui";

type AdminPaymentsContentProps = {
  webhookLogs: AdminWebhookLogItem[];
  recentPayments: AdminPaymentLogItem[];
};

function formatAmount(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-ink">
      {label}
    </span>
  );
}

export function AdminPaymentsContent({
  webhookLogs,
  recentPayments,
}: AdminPaymentsContentProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-sm font-black text-wadeal-ink">최근 결제 기록</h2>
        <div className={`${ui.panel} overflow-x-auto p-0`}>
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-black uppercase text-wadeal-muted">
                <th className="px-3 py-2">주문</th>
                <th className="px-3 py-2">상태</th>
                <th className="px-3 py-2">금액</th>
                <th className="px-3 py-2">수단</th>
                <th className="px-3 py-2">paymentKey</th>
                <th className="px-3 py-2">승인</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.length === 0 ?
                <tr>
                  <td className="px-3 py-4 text-wadeal-muted" colSpan={6}>
                    결제 기록이 없어요.
                  </td>
                </tr>
              : recentPayments.map((payment) => (
                  <tr className="border-b border-gray-50" key={payment.id}>
                    <td className="px-3 py-2.5 font-bold text-wadeal-ink">
                      {payment.orderId.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge label={payment.statusLabel} />
                    </td>
                    <td className="px-3 py-2.5">
                      {formatAmount(payment.confirmedAmount ?? payment.requestedAmount)}
                    </td>
                    <td className="px-3 py-2.5 text-wadeal-muted">{payment.method ?? "-"}</td>
                    <td className="max-w-[140px] truncate px-3 py-2.5 font-mono text-[10px] text-wadeal-muted">
                      {payment.paymentKey ?? "-"}
                    </td>
                    <td className="px-3 py-2.5 text-wadeal-muted">
                      {payment.approvedAtLabel ?? payment.createdAtLabel}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-black text-wadeal-ink">웹훅 로그</h2>
        <div className={`${ui.panel} overflow-x-auto p-0`}>
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-black uppercase text-wadeal-muted">
                <th className="px-3 py-2">시간</th>
                <th className="px-3 py-2">이벤트</th>
                <th className="px-3 py-2">상태</th>
                <th className="px-3 py-2">orderId</th>
                <th className="px-3 py-2">paymentKey</th>
                <th className="px-3 py-2">메모</th>
              </tr>
            </thead>
            <tbody>
              {webhookLogs.length === 0 ?
                <tr>
                  <td className="px-3 py-4 text-wadeal-muted" colSpan={6}>
                    웹훅 로그가 없어요.
                  </td>
                </tr>
              : webhookLogs.map((log) => (
                  <tr className="border-b border-gray-50" key={log.id}>
                    <td className="px-3 py-2.5 text-wadeal-muted">{log.createdAtLabel}</td>
                    <td className="px-3 py-2.5 font-bold text-wadeal-ink">{log.eventType}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge label={log.statusLabel} />
                    </td>
                    <td className="max-w-[120px] truncate px-3 py-2.5 font-mono text-[10px]">
                      {log.orderId ?? "-"}
                    </td>
                    <td className="max-w-[120px] truncate px-3 py-2.5 font-mono text-[10px]">
                      {log.paymentKey ?? "-"}
                    </td>
                    <td className="max-w-[160px] truncate px-3 py-2.5 text-wadeal-muted">
                      {log.errorMessage ?? log.eventId ?? "-"}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
