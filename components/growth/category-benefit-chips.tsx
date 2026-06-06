"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CATEGORY_BENEFIT_CHIPS = [
  { key: "coupon", label: "쿠폰상품", params: { minDiscount: "20" } },
  { key: "special", label: "오늘특가", params: { minDiscount: "30" } },
  { key: "popular", label: "많이담은", params: { sort: "popular" } },
  { key: "freeShip", label: "무료배송", params: { freeShip: "1" } },
] as const;

/** 카테고리 혜택 chip — 4개 이하 compact */
export function CategoryBenefitChips() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function isActive(params: Record<string, string>) {
    return Object.entries(params).every(([key, value]) => searchParams.get(key) === value);
  }

  function handleClick(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    const active = isActive(params);

    if (active) {
      for (const key of Object.keys(params)) {
        next.delete(key);
      }
    } else {
      next.delete("page");
      for (const [key, value] of Object.entries(params)) {
        next.set(key, value);
      }
    }

    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {CATEGORY_BENEFIT_CHIPS.map((chip) => {
        const active = isActive(chip.params);
        return (
          <button
            aria-pressed={active}
            className={`h-9 shrink-0 cursor-pointer rounded-full px-3.5 text-[13px] font-medium transition-colors duration-[100ms] ease-out active:scale-[0.98] ${
              active ?
                "border border-[#2E5E4E] bg-[#F5F7F6] text-[#2E5E4E]"
              : "border border-[#E8ECEA] bg-white text-[#111111]"
            }`}
            key={chip.key}
            onClick={() => handleClick(chip.params)}
            type="button"
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

/** @deprecated chips use button navigation — kept for compatibility */
function CategoryBenefitChipLink({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link
      className="h-9 shrink-0 rounded-full border border-[#E8ECEA] px-3.5 text-[13px] font-medium"
      href={href}
    >
      {label}
    </Link>
  );
}
