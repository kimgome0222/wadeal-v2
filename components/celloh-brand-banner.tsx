import Link from "next/link";

import { CELLOH_BRAND } from "@/lib/brand/copy";

type CellohBrandBannerProps = {
  href?: string;
};

export function CellohBrandBanner({ href = "/category/all" }: CellohBrandBannerProps) {
  return (
    <section className="relative min-w-0 bg-white pb-2 pt-3">
      <div className="relative overflow-hidden rounded-xl bg-[#2E5E4E] px-5 py-5">
        <div className="relative">
          <p className="text-[11px] font-medium text-white/75">{CELLOH_BRAND.name}</p>
          <h1 className="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-white">
            {CELLOH_BRAND.tagline}
          </h1>
          <p className="mt-2 text-[12px] font-normal leading-relaxed text-white/80">
            {CELLOH_BRAND.subline}
          </p>
          <p className="mt-1 text-[11px] font-normal text-white/65">{CELLOH_BRAND.philosophy}</p>
          <Link
            className="celloh-transition mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-white px-3.5 text-[12px] font-medium text-[#2E5E4E] hover:bg-white/95 active:scale-[0.98]"
            href={href}
          >
            상품 둘러보기
          </Link>
        </div>
      </div>
    </section>
  );
}
