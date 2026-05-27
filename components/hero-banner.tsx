import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="rounded-lg border border-red-100 bg-[#fff6f3] px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-black text-wadeal-ink">친구와 같이 사면 더 싸져요</p>
          <p className="text-xs font-extrabold text-wadeal-red">2명만 더 모이면 최저가</p>
        </div>
        <Link
          className="h-8 shrink-0 rounded-full bg-wadeal-red px-3 text-[11px] font-black leading-8 text-white"
          href="/share/wd-vacuum-001"
        >
          공유하기
        </Link>
      </div>
    </section>
  );
}
