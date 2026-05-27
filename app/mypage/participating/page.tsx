import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { currency, getDealById } from "@/lib/deals";

const participating = ["wd-vacuum-001", "wd-beef-001"];

export default function ParticipatingPage() {
  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="참여 중 공동구매" />
      <ul className="divide-y divide-wadeal-line px-4">
        {participating.map((slug) => {
          const deal = getDealById(slug);
          if (!deal) return null;
          return (
            <li className="py-3.5" key={slug}>
              <Link className="flex gap-3 active:opacity-80" href={`/product/${slug}`}>
                <img
                  alt={deal.title}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover bg-gray-100"
                  src={deal.imageUrl}
                />
                <div>
                  <p className="text-sm font-extrabold text-wadeal-ink">{deal.title}</p>
                  <p className="mt-1 text-sm font-black text-wadeal-red">
                    {currency.format(deal.groupPrice)}원
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-wadeal-red">참여 중</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
