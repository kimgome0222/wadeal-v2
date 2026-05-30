import Image from "next/image";
import Link from "next/link";

import { SectionHeader } from "@/components/ds/section-header";
import type { HomeSellerStory } from "@/lib/home/seller-stories";
import { motion } from "@/lib/ui";

type HomeSellerStoriesSectionProps = {
  stories: HomeSellerStory[];
};

export function HomeSellerStoriesSection({ stories }: HomeSellerStoriesSectionProps) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <section aria-label="판매자 이야기" className={`${motion.sectionEnter} pt-10`}>
      <div className="px-6">
        <SectionHeader
          subtitle="상품 뒤에 있는 사람과 이야기를 만나보세요."
          title="판매자 이야기"
        />
      </div>
      <div className="mt-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-6 pb-0.5">
        {stories.map((story) => (
          <Link
            className="flex h-[280px] w-[320px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white active:scale-[0.99]"
            href={story.href}
            key={story.id}
          >
            <div className="relative h-[160px] w-full shrink-0 bg-[#F5F7F6]">
              {story.imageUrl ?
                <Image
                  alt={story.title}
                  className="object-cover"
                  fill
                  sizes="320px"
                  src={story.imageUrl}
                />
              : null}
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-3">
              <p className="truncate text-[12px] font-medium text-[#666666]">
                {story.sellerName}
              </p>
              <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#111111]">
                {story.title}
              </h3>
              <p className="line-clamp-2 text-[13px] font-normal leading-relaxed text-[#666666]">
                {story.summary}
              </p>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </section>
  );
}
