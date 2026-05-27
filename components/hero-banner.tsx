import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="flex items-center justify-between gap-2 rounded-lg bg-wadeal-surface px-3 py-1.5">
      <div className="min-w-0 leading-tight">
        <p className="text-[12px] font-black text-wadeal-ink">
          친구와 같이 사면 더 싸져요
        </p>
        <p className="text-[11px] font-extrabold text-wadeal-red">
          최저가까지 2명 남음
        </p>
      </div>
      <Link
        className="h-6 shrink-0 rounded-md bg-wadeal-red px-2.5 text-[10px] font-black leading-6 text-white"
        href="/share/wd-vacuum-001"
      >
        공유
      </Link>
    </section>
  );
}
