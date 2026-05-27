import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="flex items-center justify-between gap-2 rounded-lg bg-gradient-to-r from-[#fff5f3] to-white px-3 py-2 ring-1 ring-red-100">
      <div className="min-w-0">
        <p className="text-[13px] font-black leading-tight text-wadeal-ink">
          친구와 같이 사면 더 싸져요
        </p>
        <p className="mt-0.5 text-xs font-extrabold text-wadeal-red">
          최저가까지 2명 남음
        </p>
      </div>
      <Link
        className="h-7 shrink-0 rounded-full bg-wadeal-red px-3 text-[11px] font-black leading-7 text-white"
        href="/share/wd-vacuum-001"
      >
        공유
      </Link>
    </section>
  );
}
