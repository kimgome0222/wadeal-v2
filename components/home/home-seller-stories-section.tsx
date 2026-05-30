"use client";

import Link from "next/link";

import { SectionHeader } from "@/components/ds/section-header";
import { SELLER_STORY_SHOWCASE } from "@/lib/home/seller-showcase-mock";
import { motion } from "@/lib/ui";

/** 판매자 이야기 — 자기소개 2~3명 가로 스크롤 */
export function HomeSellerStoriesSection() {
  const stories = SELLER_STORY_SHOWCASE.slice(0, 3);

  return (
    <section
      aria-label="판매자 이야기"
      className={`${motion.sectionEnter} overflow-visible pt-10`}
      id="home-section-seller-stories"
    >
      <div className="px-6">
        <SectionHeader
          subtitle="셀러가 직접 전하는 상품과 브랜드 이야기"
          title="판매자 이야기"
        />
      </div>
      <div className="mt-4 snap-x snap-mandatory overflow-x-auto no-scrollbar">
        <div aria-label="판매자 이야기" className="flex snap-x snap-mandatory gap-4 px-6" role="list">
          {stories.map((story) => (
            <Link
              aria-label={`${story.name} 판매자 프로필 보기`}
              className="seller-story-item flex min-w-0 flex-none snap-start cursor-pointer flex-col rounded-[24px] border border-[#E8ECEA] bg-white p-5 active:scale-[0.99]"
              href={story.href}
              key={story.id}
              role="listitem"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5F7F6] text-[20px] font-bold text-[#2E5E4E]">
                  {story.name.slice(0, 1)}
                </span>
                <p className="text-[16px] font-bold text-[#111111]">{story.name}</p>
              </div>
              <p className="mt-4 line-clamp-3 text-[14px] leading-relaxed text-[#444444]">
                {story.intro}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {story.chips.map((chip) => (
                  <span
                    className="rounded-full border border-[#E8ECEA] bg-white px-2.5 py-1 text-[11px] font-medium text-[#666666]"
                    key={chip}
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-flex text-[14px] font-semibold text-[#2E5E4E]">
                판매자 보기
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
