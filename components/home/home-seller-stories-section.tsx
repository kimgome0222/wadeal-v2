import Image from "next/image";
import Link from "next/link";

import { SectionHeader } from "@/components/ds/section-header";
import type { HomeSellerStory } from "@/lib/home/seller-stories";
import { motion } from "@/lib/ui";

type HomeSellerStoriesSectionProps = {
  stories: HomeSellerStory[];
};

export function HomeSellerStoriesSection({ stories }: HomeSellerStoriesSectionProps) {
  const visibleStories = stories.slice(0, 2);

  if (visibleStories.length === 0) {
    return null;
  }

  return (
    <section aria-label="판매자 이야기" className={`${motion.sectionEnter} pt-10`}>
      <div className="px-6">
        <SectionHeader
          subtitle="상품 뒤에 있는 이야기를 만나보세요."
          title="판매자 이야기"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 px-6">
        {visibleStories.map((story) => (
          <Link
            className="flex h-[120px] min-w-0 overflow-hidden rounded-[16px] border border-[#E8ECEA] bg-white active:scale-[0.99]"
            href={story.href}
            key={story.id}
          >
            <div className="relative h-full w-[88px] shrink-0 bg-[#F5F7F6]">
              {story.imageUrl ?
                <Image
                  alt={story.title}
                  className="object-cover"
                  fill
                  sizes="88px"
                  src={story.imageUrl}
                />
              : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-2.5 py-2">
              <p className="truncate text-[11px] font-medium text-[#666666]">
                {story.sellerName}
              </p>
              <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#111111]">
                {story.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
