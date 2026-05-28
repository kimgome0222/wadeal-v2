"use client";

import type { PointTransaction } from "@/lib/discounts/points";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type MypagePointsContentProps = {
  balance: number;
  transactions: PointTransaction[];
};

const TYPE_LABELS: Record<PointTransaction["type"], string> = {
  earn: "적립",
  use: "사용",
  refund: "환불",
  expire: "소멸",
  adjust: "조정",
};

export function MypagePointsContent({ balance, transactions }: MypagePointsContentProps) {
  return (
    <div className="space-y-3">
      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <p className="text-xs font-bold text-wadeal-muted">보유 포인트</p>
        <p className="mt-2 text-2xl font-black text-wadeal-ink">
          {currency.format(balance)}P
        </p>
      </article>

      <section className="space-y-2">
        <h2 className={ui.sectionTitle}>포인트 내역</h2>
        {transactions.length === 0 ?
          <p className="rounded-xl border border-dashed border-wadeal-line px-4 py-8 text-center text-xs font-bold text-wadeal-muted">
            포인트 내역이 없어요.
          </p>
        : <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
            {transactions.map((tx) => {
              const isPositive = tx.type === "earn" || tx.type === "refund" || tx.type === "adjust";
              return (
                <li className="px-4 py-3" key={tx.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-wadeal-ink">
                        {TYPE_LABELS[tx.type]}
                      </p>
                      {tx.reason ?
                        <p className="mt-0.5 text-[11px] font-bold text-wadeal-muted">
                          {tx.reason}
                        </p>
                      : null}
                      <p className="mt-1 text-[10px] font-bold text-wadeal-muted">
                        {new Date(tx.createdAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-black ${
                        isPositive ? "text-wadeal-ink" : "text-wadeal-red"
                      }`}
                    >
                      {isPositive ? "+" : "-"}
                      {currency.format(tx.amount)}P
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        }
      </section>
    </div>
  );
}
