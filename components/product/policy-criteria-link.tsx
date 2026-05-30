import Link from "next/link";

type PolicyCriteriaLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export function PolicyCriteriaLink({ href, label, className = "" }: PolicyCriteriaLinkProps) {
  return (
    <p className={`text-[12px] text-[#999999] ${className}`.trim()}>
      <Link className="font-medium text-[#666666] underline underline-offset-2" href={href}>
        {label}
      </Link>
    </p>
  );
}
