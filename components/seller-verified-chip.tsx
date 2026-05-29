type SellerVerifiedChipProps = {
  className?: string;
  label?: string;
};

export function SellerVerifiedChip({
  className = "",
  label = "인증 판매자",
}: SellerVerifiedChipProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-wadeal-red/10 px-1.5 py-0.5 text-[9px] font-black text-wadeal-red transition-all duration-[250ms] ease-smooth group-hover:bg-wadeal-red/15 ${className}`.trim()}
    >
      {label}
    </span>
  );
}
