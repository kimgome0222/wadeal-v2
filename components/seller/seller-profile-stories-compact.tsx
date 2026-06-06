import Image from "next/image";
import Link from "next/link";

import type { HomeSellerStory } from "@/lib/home/seller-stories";

type SellerProfileStoriesCompactProps = {
  stories: HomeSellerStory[];
};

/** 판매자 프로필 — 짧은 이야기 rail (최대 2개) */
export function SellerProfileStoriesCompact({ stories }: SellerProfileStoriesCompactProps) {
  const visible = stories.slice(0, 2);

  if (visible.length === 0) {
    return null;
  }

  return (
    <section aria-label="판매자 이야기" className="space-y-3 px-6">
      <h2 className="text-[18px] font-bold text-[#111111]">판매자 이야기</h2>
      <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-0.5">
        {visible.map((story) => (
          <Link
            className="flex h-[120px] w-[240px] shrink-0 items-center gap-3 overflow-hidden rounded-2xl border border-[#E8ECEA] bg-white p-3 active:scale-[0.99]"
            href={story.href}
            key={story.id}
          >
            <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[#F5F7F6]">
              {story.imageUrl ?
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="88px"
                  src={story.imageUrl}
                />
              : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#111111]">
                {story.title}
              </p>
              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#666666]">
                {story.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
