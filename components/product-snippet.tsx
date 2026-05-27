import { currency } from "@/lib/deals";
import type { Deal } from "@/lib/deals";

type ProductSnippetProps = {
  deal: Deal;
  size?: "sm" | "md";
};

export function ProductSnippet({ deal, size = "md" }: ProductSnippetProps) {
  const imageSize = size === "sm" ? "h-16 w-16" : "h-20 w-20";

  return (
    <div className="flex gap-3">
      <img
        alt={deal.title}
        className={`${imageSize} shrink-0 rounded-lg object-cover bg-gray-100`}
        src={deal.imageUrl}
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-extrabold text-wadeal-ink">
          {deal.title}
        </p>
        <p className="mt-1.5 text-lg font-black text-wadeal-red">
          {currency.format(deal.groupPrice)}원
        </p>
      </div>
    </div>
  );
}
