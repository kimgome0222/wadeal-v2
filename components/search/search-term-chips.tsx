import Link from "next/link";

type SearchTermChipsProps = {
  terms: string[];
  ariaLabel?: string;
};

export function SearchTermChip({ term }: { term: string }) {
  return (
    <Link
      className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-[18px] border border-[#E8ECEA] bg-white px-3.5 text-[13px] font-medium text-[#111111] transition-colors active:scale-[0.98] hover:border-[#2E5E4E]/30"
      href={`/search?q=${encodeURIComponent(term)}`}
    >
      {term}
    </Link>
  );
}

export function SearchTermChips({ terms, ariaLabel }: SearchTermChipsProps) {
  if (terms.length === 0) {
    return null;
  }

  return (
    <div
      aria-label={ariaLabel}
      className="flex flex-wrap gap-2.5"
    >
      {terms.map((term) => (
        <SearchTermChip key={term} term={term} />
      ))}
    </div>
  );
}
