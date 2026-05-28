import Link from "next/link";

type WadealLogoProps = {
  href?: string;
  className?: string;
  size?: "sm" | "md";
  /** 홈 헤더: Wadeal 워드마크 (이전 디자인) */
  variant?: "wordmark" | "brand";
};

export function WadealLogo({
  href = "/",
  className = "",
  size = "md",
  variant = "wordmark",
}: WadealLogoProps) {
  const wordmarkSize = size === "sm" ? "text-[17px]" : "text-xl";

  const content =
    variant === "brand" ?
      <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
        <span
          aria-hidden
          className={`flex shrink-0 items-center justify-center rounded-md bg-wadeal-red font-black text-white ${
            size === "sm" ? "h-7 w-7 text-sm" : "h-8 w-8 text-base"
          }`}
        >
          W
        </span>
        <span
          className={`font-black tracking-[-0.03em] text-wadeal-ink ${size === "sm" ? "text-[15px]" : "text-[17px]"}`}
        >
          와딜 <span className="font-bold text-wadeal-muted">|</span>{" "}
          <span className="text-wadeal-red">공동구매</span>
        </span>
      </span>
    :       <span
        className={`shrink-0 font-bold tracking-[-0.04em] text-wadeal-red ${wordmarkSize} ${className}`.trim()}
      >
        Wadeal
      </span>;

  if (href) {
    return (
      <Link className="shrink-0 cursor-pointer active:opacity-80" href={href}>
        {content}
      </Link>
    );
  }

  return content;
}
