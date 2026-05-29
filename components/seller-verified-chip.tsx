import { ds } from "@/lib/design-system";

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
      className={`${ds.badge.trust} ${ds.badge.verified} shrink-0 ${className}`.trim()}
    >
      {label}
    </span>
  );
}
