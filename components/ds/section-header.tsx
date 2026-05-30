import Link from "next/link";

import { ds } from "@/lib/design-system";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  moreHref?: string;
  moreLabel?: string;
  muted?: boolean;
};

export function SectionHeader({
  title,
  subtitle,
  moreHref,
  moreLabel = "더보기",
  muted = false,
}: SectionHeaderProps) {
  return (
    <div className={ds.section.head}>
      <div className="min-w-0">
        <h2 className={muted ? `${ds.type.h2} text-wadeal-muted` : ds.type.h2}>{title}</h2>
        {subtitle ?
          <p className={`mt-1 ${ds.type.caption}`}>{subtitle}</p>
        : null}
      </div>
      {moreHref ?
        <Link className={`${ds.type.link} shrink-0`} href={moreHref}>
          {moreLabel}
        </Link>
      : null}
    </div>
  );
}
