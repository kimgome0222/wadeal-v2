type SellerProfileStatsProps = {
  rating: string;
  totalSales: number;
  reviewCount: number;
};

const items = (
  rating: string,
  totalSales: number,
  reviewCount: number,
) =>
  [
    { icon: "⭐", value: rating, label: "평점" },
    {
      icon: "📦",
      value: `${totalSales.toLocaleString("ko-KR")}건`,
      label: "판매",
    },
    {
      icon: "💬",
      value: `${reviewCount.toLocaleString("ko-KR")}개`,
      label: "후기",
    },
  ] as const;

export function SellerProfileStats({
  rating,
  totalSales,
  reviewCount,
}: SellerProfileStatsProps) {
  return (
    <section aria-label="판매자 핵심 통계" className="px-6">
      <div className="grid grid-cols-3 gap-2 rounded-[20px] bg-[#F5F7F6] p-4">
        {items(rating, totalSales, reviewCount).map((item) => (
          <div className="flex flex-col items-center gap-1 text-center" key={item.label}>
            <p className="text-[18px] font-bold tabular-nums text-[#111111]">
              {item.icon} {item.value}
            </p>
            <p className="text-[12px] text-[#666666]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
