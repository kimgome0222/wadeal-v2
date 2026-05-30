"use client";

import { useCallback, useEffect, useState } from "react";

type SectionId = "detail" | "shipping" | "reviews" | "qna";

const sections: { id: SectionId; label: string; anchor: string }[] = [
  { id: "detail", label: "상품설명", anchor: "product-detail-highlights" },
  { id: "shipping", label: "배송·교환·환불", anchor: "product-shipping-info" },
  { id: "reviews", label: "리뷰", anchor: "product-reviews" },
  { id: "qna", label: "Q&A", anchor: "product-qna" },
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
  const [active, setActive] = useState<SectionId>("detail");

  const scrollTo = useCallback((sectionId: SectionId, anchor: string) => {
    setActive(sectionId);
    requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    const hashTab = HASH_TARGETS[window.location.hash];
    if (!hashTab) {
      return;
    }

    const target = sections.find((item) => item.id === hashTab);
    if (target) {
      scrollTo(hashTab, target.anchor);
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
      className="sticky top-12 z-20 -mx-4 border-b border-[#DDE8E2] bg-white"
    >
      <div className="flex">
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
              className={`relative min-h-[44px] flex-1 cursor-pointer py-3 text-center text-[11px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wadeal-red/20 ${
                isActive ? "text-wadeal-ink" : "text-wadeal-muted"
              }`}
              key={section.id}
              onClick={() => scrollTo(section.id, section.anchor)}
              type="button"
            >
              {label}
              {isActive ?
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-wadeal-ink" />
              : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
