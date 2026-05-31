"use client";

import { useCallback, useEffect, useState } from "react";

type SectionId = "description" | "info" | "reviews" | "qna";

const sections: { id: SectionId; label: string; anchor: string }[] = [
  { id: "description", label: "상품설명", anchor: "product-detail-visual" },
  { id: "info", label: "상세정보", anchor: "product-detail-info" },
  { id: "reviews", label: "후기", anchor: "product-reviews" },
  { id: "qna", label: "문의", anchor: "product-qna" },
];

const HASH_TARGETS: Record<string, SectionId> = {
  "#product-reviews": "reviews",
  "#product-qna": "qna",
};

type ProductDetailSectionNavProps = {
  reviewCount?: number;
  qnaCount?: number;
};

export function ProductDetailSectionNav({
  reviewCount = 0,
  qnaCount = 0,
}: ProductDetailSectionNavProps) {
  const [active, setActive] = useState<SectionId>("description");

  const scrollTo = useCallback((sectionId: SectionId, anchor: string) => {
    setActive(sectionId);
    requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    const hashTab = HASH_TARGETS[hash];
    if (hashTab) {
      const target = sections.find((item) => item.id === hashTab);
      if (target) {
        scrollTo(hashTab, target.anchor);
      }
      return;
    }

    if (hash.startsWith("#review-")) {
      scrollTo("reviews", "product-reviews");
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [scrollTo]);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.anchor))
      .filter((element): element is HTMLElement => element != null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) {
          return;
        }

        const matched = sections.find((section) => section.anchor === visible[0]?.target.id);
        if (matched) {
          setActive(matched.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.15, 0.4] },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="상품 상세 메뉴"
      className="sticky top-14 z-20 -mx-6 min-w-0 border-b border-[#E8ECEA] bg-white"
    >
      <div className="flex min-w-0 px-6">
        {sections.map((section) => {
          const isActive = active === section.id;
          let label = section.label;
          if (section.id === "reviews" && reviewCount > 0) {
            label = `${section.label} ${reviewCount}`;
          }
          if (section.id === "qna" && qnaCount > 0) {
            label = `${section.label} ${qnaCount}`;
          }

          return (
            <button
              aria-current={isActive ? "true" : undefined}
              aria-label={`${section.label} 섹션으로 이동`}
              className={`relative flex h-12 min-h-[44px] flex-1 cursor-pointer items-center justify-center text-[14px] font-semibold transition-colors active:bg-[#F5F7F6] active:scale-[0.99] ${
                isActive ? "text-[#2E5E4E]" : "text-[#666666]"
              }`}
              key={section.id}
              onClick={() => scrollTo(section.id, section.anchor)}
              type="button"
            >
              {label}
              {isActive ?
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#2E5E4E]" />
              : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
