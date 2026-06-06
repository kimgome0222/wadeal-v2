import Link from "next/link";

import { SellerCard } from "@/components/seller-card";
import type { SellerProfile } from "@/lib/sellers/types";
import { ui } from "@/lib/ui";

type HomeSellersCarouselSectionProps = {
  sellers: SellerProfile[];
  ariaLabel: string;
  title: string;
  subtitle?: string;
  kicker?: string;
  moreHref?: string;
  moreLabel?: string;
  variant?: "featured" | "compact";
};

export function HomeSellersCarouselSection({
  sellers,
  ariaLabel,
  title,
  subtitle,
  kicker = "celloh",
  moreHref = "/category/all",
  moreLabel = "더보기",
  variant = "featured",
}: HomeSellersCarouselSectionProps) {
  if (sellers.length === 0) {
    return null;
  }

  const isCompact = variant === "compact";

  return (
    <section aria-label={ariaLabel} className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.12em] text-wadeal-red/80">
            {kicker}
          </p>
          <h2 className={`${ui.sectionTitleAccent} mt-1`}>{title}</h2>
          {subtitle ?
            <p className="mt-1.5 text-xs font-medium leading-relaxed text-wadeal-muted">
              {subtitle}
            </p>
          : null}
        </div>
        <Link
          className="shrink-0 text-[13px] font-bold text-wadeal-red transition-colors hover:opacity-80"
          href={moreHref}
        >
          {moreLabel}
        </Link>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {sellers.map((seller) => (
          <SellerCard key={seller.id} seller={seller} variant={isCompact ? "compact" : "featured"} />
        ))}
      </div>
    </section>
  );
}
