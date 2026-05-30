import { DealCard } from "@/components/deal-card";
import { SectionHeader } from "@/components/ds/section-header";
import type { Deal } from "@/lib/deals";
import { ds } from "@/lib/design-system";
import { motion } from "@/lib/ui";

type HomeProductGridSectionProps = {
  deals: Deal[];
  title: string;
  subtitle?: string;
  ariaLabel: string;
  moreHref?: string;
  className?: string;
};

export function HomeProductGridSection({
  deals,
  title,
  subtitle,
  ariaLabel,
  moreHref,
  className = "pt-10",
}: HomeProductGridSectionProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <section aria-label={ariaLabel} className={`${motion.sectionEnter} ${className}`}>
      <SectionHeader moreHref={moreHref} subtitle={subtitle} title={title} />
      <div className={ds.spacing.productGrid}>
        {deals.map((deal) => (
          <DealCard deal={deal} key={deal.slug} />
        ))}
      </div>
    </section>
  );
}
