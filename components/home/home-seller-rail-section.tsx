import Link from "next/link";

import { SectionHeader } from "@/components/ds/section-header";
import type { SellerProfile } from "@/lib/sellers/types";
import { getSellerPublicProfileHref } from "@/lib/sellers/routes";
import { motion } from "@/lib/ui";

type HomeSellerRailCardProps = {
  seller: SellerProfile;
  showNew?: boolean;
};

export function HomeSellerRailCard({ seller, showNew = false }: HomeSellerRailCardProps) {
  return (
    <Link
      className="flex w-[200px] shrink-0 flex-col gap-1.5 rounded-[20px] border border-[#E8ECEA] bg-white p-3 active:scale-[0.99]"
      href={getSellerPublicProfileHref(seller)}
    >
      <div className="flex min-w-0 items-start gap-1.5">
        <p className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#111111]">
          {seller.name}
        </p>
        {showNew ?
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-[#E28A3B]">
            NEW
          </span>
        : null}
      </div>
      <p className="line-clamp-2 min-h-[2.25rem] text-[12px] font-medium leading-snug text-[#666666]">
        {seller.tagline}
      </p>
      <p className="text-[12px] text-[#666666]">⭐ {seller.rating.toFixed(1)}</p>
      <p className="text-[12px] text-[#666666]">
        📦 {seller.totalSales.toLocaleString("ko-KR")}건
      </p>
    </Link>
  );
}

type HomeSellerRailSectionProps = {
  sellers: SellerProfile[];
  title: string;
  subtitle?: string;
  ariaLabel: string;
  showNew?: boolean;
  className?: string;
};

export function HomeSellerRailSection({
  sellers,
  title,
  subtitle,
  ariaLabel,
  showNew = false,
  className = "pt-10",
}: HomeSellerRailSectionProps) {
  if (sellers.length === 0) {
    return null;
  }

  return (
    <section aria-label={ariaLabel} className={`${motion.sectionEnter} ${className}`}>
      <SectionHeader subtitle={subtitle} title={title} />
      <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-0.5">
        {sellers.map((seller) => (
          <HomeSellerRailCard key={seller.id} seller={seller} showNew={showNew} />
        ))}
      </div>
    </section>
  );
}
