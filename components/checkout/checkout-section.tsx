import type { ReactNode } from "react";

type CheckoutSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function CheckoutSection({ title, children, className = "" }: CheckoutSectionProps) {
  return (
    <section className={`space-y-4 ${className}`.trim()}>
      <h2 className="text-[18px] font-bold text-[#111111]">{title}</h2>
      <div className="rounded-[20px] border border-[#E8ECEA] bg-white p-4">{children}</div>
    </section>
  );
}
