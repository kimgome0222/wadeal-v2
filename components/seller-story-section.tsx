import type { Deal } from "@/lib/deals";
import { buildSellerStory } from "@/lib/sellers/seller-story";
import { ui } from "@/lib/ui";

type SellerStorySectionProps = {
  deal: Deal;
};

export function SellerStorySection({ deal }: SellerStorySectionProps) {
  const story = buildSellerStory(deal);

  return (
    <section className={`${ui.card} mt-4 space-y-4 p-5`} id="seller-story">
      <div>
        <p className="text-[11px] font-bold tracking-[0.1em] text-wadeal-red/80">판매자 스토리</p>
        <h2 className="mt-1 text-base font-black text-wadeal-ink">{story.sellerName}의 이야기</h2>
        <p className="mt-1 text-xs font-medium text-wadeal-muted">
          누가 만들었는지, 어떻게 만드는지 알아보세요.
        </p>
      </div>

      <div className="space-y-3">
        {story.blocks.map((block) => (
          <article
            className="rounded-xl border border-wadeal-line bg-wadeal-surface/40 px-4 py-3.5"
            key={block.title}
          >
            <h3 className="text-sm font-bold text-wadeal-ink">{block.title}</h3>
            <p className="mt-2 text-xs font-medium leading-relaxed text-wadeal-muted">{block.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
