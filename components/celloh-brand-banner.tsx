import Link from "next/link";

type CellohBrandBannerProps = {
  href?: string;
};

export function CellohBrandBanner({ href = "/category/all" }: CellohBrandBannerProps) {
  return (
    <section className="relative min-w-0 overflow-hidden bg-white pb-1 pt-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-3 top-6 hidden h-24 w-24 rounded-2xl border border-wadeal-line bg-white shadow-card sm:block [animation-delay:450ms] animate-celloh-fade-in-up"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-8 top-14 hidden h-16 w-16 rounded-xl border border-wadeal-line/80 bg-wadeal-surface/80 sm:block [animation-delay:525ms] animate-celloh-fade-in-up"
      />

      <p className="animate-celloh-fade-in-up text-[11px] font-bold tracking-[0.12em] [animation-delay:75ms]">
        <span className="text-wadeal-red">cello</span>
        <span className="text-wadeal-coral">h</span>
      </p>

      <h1 className="animate-celloh-banner-in mt-3 max-w-[18rem] text-[1.65rem] font-black leading-[1.22] tracking-[-0.045em] text-wadeal-red sm:max-w-none sm:text-[2rem] [animation-delay:150ms]">
        누가 만들었는지 알고 사세요.
      </h1>

      <p className="animate-celloh-fade-in-up mt-3 max-w-[20rem] text-[15px] font-semibold leading-relaxed text-wadeal-ink sm:max-w-none sm:text-base [animation-delay:225ms]">
        좋은 상품은 좋은 판매자에게서 시작됩니다.
      </p>
      <p className="animate-celloh-fade-in-up mt-1.5 max-w-[20rem] text-sm font-semibold leading-relaxed text-wadeal-ink/90 sm:max-w-none [animation-delay:260ms]">
        좋은 판매자의 상품을 모아놓은 쇼핑몰
      </p>
      <p className="animate-celloh-fade-in-up mt-1 max-w-[20rem] text-sm font-medium leading-relaxed text-wadeal-muted sm:max-w-none [animation-delay:300ms]">
        판매자를 알면, 상품이 보입니다.
      </p>

      <Link
        className="celloh-btn celloh-hover-lift animate-celloh-fade-in-up mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-wadeal-line bg-white px-4 text-[13px] font-bold text-wadeal-red hover:border-wadeal-red/30 hover:bg-wadeal-surface [animation-delay:375ms]"
        href={href}
      >
        상품 둘러보기
      </Link>
    </section>
  );
}
