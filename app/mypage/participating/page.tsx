import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { currency } from "@/lib/deals";
import {
  getParticipatingDealSlugs,
  getProductDetailById,
} from "@/lib/data";
import { ui } from "@/lib/ui";

export default async function ParticipatingPage() {
  const participating = await getParticipatingDealSlugs();

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="참여 중 공동구매" />
      <ul className={`${ui.listDivider} ${ui.pageBody}`}>
        {(await Promise.all(
          participating.map(async (slug) => {
            const deal = await getProductDetailById(slug);
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
          }),
        )).filter(Boolean)}
      </ul>
    </PageShell>
  );
}
