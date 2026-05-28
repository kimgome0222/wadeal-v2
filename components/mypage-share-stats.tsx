import type { ShareStats } from "@/lib/share/types";

type MypageShareStatsProps = {
  stats: ShareStats;
  referralCode: string | null;
};

export function MypageShareStats({ stats, referralCode }: MypageShareStatsProps) {
  return (
    <section className="rounded-xl border border-wadeal-line bg-white p-4">
      <p className="text-sm font-black text-wadeal-ink">내 초대 · 공유</p>
      <p className="mt-1 text-xs font-bold text-wadeal-muted">
        공유한 링크로 친구가 방문하면 아래 통계에 반영돼요.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatCard label="공유 횟수" value={stats.shareCount} />
        <StatCard label="방문 수" value={stats.visitCount} />
        <StatCard label="전환" value={stats.conversionCount} hint="준비 중" />
      </div>

      {referralCode ?
        <p className="mt-4 rounded-lg bg-wadeal-surface/70 px-3 py-2 text-[11px] font-bold text-wadeal-muted">
          내 추천 코드{" "}
          <span className="font-black text-wadeal-ink">{referralCode}</span>
        </p>
      : null}
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-wadeal-line bg-wadeal-surface/40 px-3 py-3 text-center">
      <p className="text-[10px] font-bold text-wadeal-muted">{label}</p>
      <p className="mt-1 text-lg font-black text-wadeal-ink">{value}</p>
      {hint ?
        <p className="mt-0.5 text-[10px] font-bold text-wadeal-muted">{hint}</p>
      : null}
    </div>
  );
}
