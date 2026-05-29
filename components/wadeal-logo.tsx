import Image from "next/image";
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
  const wordmarkHeight = size === "sm" ? 20 : 24;
  const wordmarkWidth = size === "sm" ? 88 : 100;

  const content =
    variant === "brand" ?
      <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
        <span
          aria-hidden
          className={`flex shrink-0 items-center justify-center rounded-md bg-wadeal-red font-bold text-white ${
            size === "sm" ? "h-7 w-7 text-sm" : "h-8 w-8 text-base"
          }`}
        >
          c
        </span>
        <span
          className={`font-bold tracking-[-0.03em] text-wadeal-ink ${size === "sm" ? "text-[15px]" : "text-[17px]"}`}
        >
          celloh <span className="font-medium text-wadeal-muted">|</span>{" "}
          <span className="text-wadeal-red">공동구매</span>
        </span>
      </span>
    : variant === "light" ?
      <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
        <span
          aria-hidden
          className={`flex shrink-0 items-center justify-center rounded-md bg-wadeal-red font-bold text-white ${
            size === "sm" ? "h-7 w-7 text-sm" : "h-8 w-8 text-base"
          }`}
        >
          c
        </span>
        <span
          className={`font-bold tracking-[-0.03em] text-white ${size === "sm" ? "text-[15px]" : "text-[17px]"}`}
        >
          celloh <span className="font-medium text-gray-400">|</span>{" "}
          <span className="text-red-300">공동구매</span>
        </span>
      </span>
    : <Image
        alt="celloh"
        className={`shrink-0 ${className}`.trim()}
        height={wordmarkHeight}
        priority
        src="/wadeal-wordmark.svg"
        width={wordmarkWidth}
      />;

  if (href) {
    return (
      <Link
        aria-label="celloh"
        className="shrink-0 cursor-pointer transition-opacity duration-150 active:opacity-80"
        href={href}
      >
        {content}
      </Link>
    );
  }

  return content;
}
