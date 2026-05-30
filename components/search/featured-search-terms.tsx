import Link from "next/link";

import { ds } from "@/lib/design-system";
import type { PopularSearchTerm } from "@/lib/search/types";

type FeaturedSearchTermsProps = {
  terms: PopularSearchTerm[];
};

export function FeaturedSearchTerms({ terms }: FeaturedSearchTermsProps) {
  if (terms.length === 0) {
    return null;
  }

  return (
    <section aria-label="추천 검색어" className={ds.spacing.searchSection}>
      <h2 className={`${ds.type.h2} ${ds.spacing.sectionHead}`}>추천 검색어</h2>
      <div className={`flex flex-wrap ${ds.spacing.chipRow} ${ds.spacing.chipRowPy}`}>
        {terms.map((term, index) => (
          <Link
            className={`${ds.chip.base} ${ds.chip.idle} inline-flex min-h-[36px] items-center gap-1.5 px-3.5 py-2 active:scale-[0.98]`}
            href={`/search?q=${encodeURIComponent(term.query)}`}
            key={term.query}
          >
            <span
              aria-hidden
              className={`text-[11px] font-semibold tabular-nums ${
                index < 3 ? "text-wadeal-coral" : "text-wadeal-muted"
              }`}
            >
              {index + 1}
            </span>
            {term.query}
          </Link>
        ))}
      </div>
    </section>
  );
}
