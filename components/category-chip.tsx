import Link from "next/link";
import type { ReactNode } from "react";

type CategoryChipProps = {
  icon?: string;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  layout?: "grid" | "rail";
};

function chipSurface(active: boolean) {
  return active ?
      "border-[#2E5E4E] bg-white text-[#2E5E4E]"
    : "border-[#E8ECEA] bg-[#F5F7F6] text-[#111111]";
}

/** 마켓컬리형 하위 카테고리 box — icon + label */
export function CategoryChip({
  icon = "📦",
  label,
  active = false,
  href,
  onClick,
  layout = "grid",
}: CategoryChipProps) {
  const surface = chipSurface(active);
  const sizeClass =
    layout === "grid" ?
      "h-[68px] w-full"
    : "h-[68px] w-[72px] shrink-0 snap-start";
  const chipBase = `flex ${sizeClass} flex-col items-center justify-center gap-1.5 rounded-[16px] border px-1 text-center transition-colors duration-[80ms] ease-out active:scale-[0.97]`;
  const labelClass = `w-full truncate text-[12px] leading-tight ${
    active ? "font-semibold text-[#2E5E4E]" : "font-medium text-[#666666]"
  }`;

  const content = (
    <>
      <span aria-hidden className="flex h-6 w-6 items-center justify-center text-[22px] leading-none">
        {icon}
      </span>
      <span className={labelClass}>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link
        aria-current={active ? "page" : undefined}
        aria-label={label}
        className={`${chipBase} ${surface} cursor-pointer`}
        href={href}
        onClick={onClick}
        scroll={false}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`${chipBase} ${surface} cursor-pointer`}
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}

/** 하위 카테고리 3열 box grid — PLP / 카테고리 패널 공통 */
export function CategoryChipGrid({
  children,
  ariaLabel,
  className = "",
}: {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className={`mb-5 grid grid-cols-3 gap-2.5 ${className}`.trim()}
      role="list"
    >
      {children}
    </div>
  );
}

/** @deprecated CategoryChipGrid 사용 — 가로 rail 전용 */
export function CategoryChipTrack({
  children,
  ariaLabel,
  className = "",
}: {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className={`no-scrollbar -mx-6 mb-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-6 ${className}`.trim()}
      role="list"
    >
      {children}
    </div>
  );
}
