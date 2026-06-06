import Link from "next/link";

type KpiMetricCardProps = {
  label: string;
  value: string;
  href?: string;
  warn?: boolean;
  deltaLabel?: string;
  className?: string;
};

const cardClass =
  "rounded-[18px] border border-[#E8ECEA] bg-white p-4 shadow-sm transition active:scale-[0.99]";

/** KPI summary card — admin/seller dashboards */
export function KpiMetricCard({
  label,
  value,
  href,
  warn = false,
  deltaLabel,
  className = "",
}: KpiMetricCardProps) {
  const content = (
    <>
      <p className="text-[13px] font-semibold text-[#666666]">{label}</p>
      <p
        className={`mt-1 text-[22px] font-bold leading-tight tracking-[-0.02em] ${
          warn ? "text-wadeal-red" : "text-[#111111]"
        }`}
      >
        {value}
      </p>
      {deltaLabel ?
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
            deltaLabel.startsWith("-") ?
              "bg-gray-100 text-gray-600"
            : "bg-[#F5F7F6] text-[#2E5E4E]"
          }`}
        >
          {deltaLabel}
        </span>
      : null}
    </>
  );

  if (href) {
    return (
      <Link className={`${cardClass} block ${className}`.trim()} href={href}>
        {content}
      </Link>
    );
  }

  return <div className={`${cardClass} ${className}`.trim()}>{content}</div>;
}
