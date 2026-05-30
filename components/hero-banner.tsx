import Link from "next/link";
import Image from "next/image";

type HeroBannerProps = {
  featuredHref?: string;
  featuredTitle?: string;
  imageUrl?: string | null;
  /** 단일 서브 문구 override (미설정 시 서브+철학 기본값 2줄) */
  subtitle?: string | null;
};

const MAIN_TAGLINE = "누가 만들었는지 알고 사세요.";
const SUB_TAGLINE = "좋은 상품은 좋은 판매자에게서 시작됩니다.";
const PHILOSOPHY_TAGLINE = "판매자를 알면, 상품이 보입니다.";

export function HeroBanner({
  featuredHref = "/category/all",
  featuredTitle,
  imageUrl,
  subtitle,
}: HeroBannerProps) {
  return (
    <section className="celloh-hover-lift overflow-hidden rounded-2xl border border-wadeal-line bg-white shadow-card">
      {imageUrl ?
        <div className="relative h-36 w-full overflow-hidden bg-gray-50">
          <Image
            alt={featuredTitle ? `${featuredTitle} 배너` : "celloh 홈 배너"}
            className="animate-celloh-fade-in object-contain p-4 transition-transform duration-300 ease-smooth hover:scale-[1.01]"
            fill
            sizes="(max-width: 430px) 430px, 430px"
            src={imageUrl}
          />
        </div>
      : null}
      <div className="px-4 py-4">
        {!featuredTitle ?
          <p className="animate-celloh-fade-in-up text-[10px] font-bold tracking-[0.12em] text-wadeal-red/80 [animation-delay:75ms]">
            celloh
          </p>
        : null}
        <p
          className={`animate-celloh-banner-in ${featuredTitle ? "" : "mt-1.5"} text-[15px] font-black leading-snug text-wadeal-ink [animation-delay:150ms]`}
        >
          {featuredTitle ?? MAIN_TAGLINE}
        </p>
        {subtitle ?
          <p className="animate-celloh-fade-in-up mt-1.5 text-xs font-bold leading-relaxed text-wadeal-muted [animation-delay:225ms]">
            {subtitle}
          </p>
        : <>
            <p className="animate-celloh-fade-in-up mt-1.5 text-xs font-bold leading-relaxed text-wadeal-muted [animation-delay:225ms]">
              {SUB_TAGLINE}
            </p>
            <p className="animate-celloh-fade-in-up mt-1 text-xs font-semibold leading-relaxed text-wadeal-muted/90 [animation-delay:300ms]">
              {PHILOSOPHY_TAGLINE}
            </p>
          </>
        }
        <Link
          className="celloh-btn celloh-hover-lift animate-celloh-fade-in-up mt-3 inline-flex h-9 cursor-pointer items-center rounded-xl bg-wadeal-red px-3.5 text-xs font-black text-white shadow-sm hover:bg-wadeal-red-deep [animation-delay:375ms]"
          href={featuredHref}
        >
          {featuredTitle ? "자세히 보기" : "상품 둘러보기"}
        </Link>
      </div>
    </section>
  );
}
