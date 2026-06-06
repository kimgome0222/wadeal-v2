import Link from "next/link";

import { CELLOH_BRAND } from "@/lib/brand/copy";

type CellohBrandBannerProps = {
  href?: string;
};

export function CellohBrandBanner({ href = "/category/all" }: CellohBrandBannerProps) {
  return (
    <section className="relative min-w-0 bg-white pb-1 pt-3">
      <div className="relative min-h-[160px] overflow-hidden rounded-[22px] bg-[#2E5E4E] p-5">
        <div className="relative">
          <p className="text-[12px] font-medium text-white/75">{CELLOH_BRAND.name}</p>
          <h1 className="mt-2 text-[23px] font-semibold leading-[1.35] tracking-[-0.02em] text-white">
            {CELLOH_BRAND.tagline}
          </h1>
          <p className="mt-2 text-[14px] font-normal leading-relaxed text-white/85">
            {CELLOH_BRAND.subline}
          </p>
          <p className="mt-1 text-[13px] font-normal leading-relaxed text-white/85">
            {CELLOH_BRAND.mallLine}
          </p>
          <p className="mt-1.5 text-[12px] font-normal text-white/70">{CELLOH_BRAND.philosophy}</p>
          <Link
            className="celloh-transition mt-4 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-[#2E5E4E] hover:bg-white/95 active:scale-[0.97]"
            href={href}
          >
            상품 둘러보기
          </Link>
        </div>
      </div>
    </section>
  );
}
