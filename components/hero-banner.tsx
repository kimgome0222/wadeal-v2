import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="rounded-xl border border-wadeal-line bg-white px-4 py-4">
      <p className="text-[15px] font-black leading-snug text-wadeal-ink">
        함께 살수록 더 저렴하게
      </p>
      <p className="mt-1.5 text-xs font-bold leading-relaxed text-wadeal-muted">
        친구와 함께 공동구매하고 최저가로 구매해보세요.
      </p>
      <Link
        className="mt-3 inline-flex h-9 cursor-pointer items-center rounded-lg bg-wadeal-red px-3.5 text-xs font-black text-white active:opacity-90"
        href="/category/all"
      >
        공동구매 둘러보기
      </Link>
    </section>
  );
}
