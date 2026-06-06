"use client";

import { useState } from "react";

import type { Deal } from "@/lib/deals";
import { ds } from "@/lib/design-system";
import { buildSellerStory } from "@/lib/sellers/seller-story";

type SellerStorySectionProps = {
  deal: Deal;
};

export function SellerStorySection({ deal }: SellerStorySectionProps) {
  const [open, setOpen] = useState(false);
  const story = buildSellerStory(deal);

  return (
    <section
      className="scroll-mt-28 overflow-hidden rounded-xl border border-[#DDE8E2] bg-white"
      id="seller-story"
    >
      <button
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-[#FAFBFA]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className={`${ds.type.bodySm} font-medium text-wadeal-ink`}>
          판매자 스토리 보기
        </span>
        <span aria-hidden className={ds.type.caption}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open ?
        <div className="space-y-2 border-t border-[#DDE8E2] px-4 pb-4 pt-3">
          {story.blocks.map((block) => (
            <article className="rounded-lg bg-[#FAFBFA] px-3 py-2.5" key={block.title}>
              <h3 className={`${ds.type.h3} font-semibold`}>{block.title}</h3>
              <p className={`mt-1 ${ds.type.caption} leading-relaxed`}>{block.body}</p>
            </article>
          ))}
        </div>
      : null}
    </section>
  );
}
