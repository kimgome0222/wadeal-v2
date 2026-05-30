import Link from "next/link";

type WadealLogoProps = {
  href?: string;
  className?: string;
  size?: "sm" | "md";
  /** 홈 헤더: celloh 워드마크 SVG · 로그인 등: brand · 다크 배경: light */
  variant?: "wordmark" | "brand" | "light";
};

export function WadealLogo({
  href = "/",
  className = "",
  size = "md",
  variant = "brand",
}: WadealLogoProps) {
  const iconSize = size === "sm" ? "h-7 w-7 text-sm" : "h-8 w-8 text-base";
  const textSize = size === "sm" ? "text-[15px]" : "text-[17px]";
  const wordmarkSize = size === "sm" ? "text-[22px]" : "text-[23px]";

  const brandMark = (textClass: string) => (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-lg bg-wadeal-red font-bold text-white shadow-sm transition-transform duration-200 ease-smooth group-hover/logo:scale-[1.03] ${iconSize}`}
      >
        c
      </span>
      <span className={`font-bold tracking-[-0.03em] ${textSize} ${textClass}`}>
        <span className="text-wadeal-red">cello</span>
        <span className="text-wadeal-coral">h</span>
      </span>
    </span>
  );

  const content =
    variant === "brand" ?
      brandMark("text-wadeal-ink")
    : variant === "light" ?
      brandMark("text-white")
    : <span
        className={`${wordmarkSize} font-semibold tracking-[-0.03em] text-[#2E5E4E] ${className}`.trim()}
      >
        celloh
      </span>;

  if (href) {
    return (
      <Link
        aria-label="celloh"
        className="group/logo shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-90 active:opacity-80"
        href={href}
      >
        {content}
      </Link>
    );
  }

  return content;
}
