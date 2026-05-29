import Link from "next/link";
import Image from "next/image";

type HeroBannerProps = {
  featuredHref?: string;
  featuredTitle?: string;
  imageUrl?: string | null;
  subtitle?: string | null;
};

export function HeroBanner({
  featuredHref = "/category/all",
  featuredTitle,
  imageUrl,
  subtitle,
}: HeroBannerProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-wadeal-line bg-white">
      {imageUrl ?
        <div className="relative h-36 w-full bg-gray-50">
          <Image alt="" className="object-contain p-4" fill src={imageUrl} unoptimized />
        </div>
      : null}
      <div className="px-4 py-4">
        <p className="text-[15px] font-black leading-snug text-wadeal-ink">
          {featuredTitle ?? "함께 살수록 더 저렴하게"}
        </p>
        <p className="mt-1.5 text-xs font-bold leading-relaxed text-wadeal-muted">
          {subtitle ?? "친구와 함께 공동구매하고 최저가로 구매해보세요."}
        </p>
        <Link
          className="mt-3 inline-flex h-9 cursor-pointer items-center rounded-lg bg-wadeal-red px-3.5 text-xs font-black text-white active:opacity-90"
          href={featuredHref}
        >
          {featuredTitle ? "자세히 보기" : "공동구매 둘러보기"}
        </Link>
      </div>
    </section>
  );
}
