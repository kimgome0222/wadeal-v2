"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type SectionId = "featured" | "products" | "reviews" | "story" | "inquiry";

type SectionDef = { id: SectionId; label: string; anchor: string };

const ALL_SECTIONS: SectionDef[] = [
  { id: "featured", label: "대표 상품", anchor: "seller-featured" },
  { id: "products", label: "전체 상품", anchor: "seller-products" },
  { id: "reviews", label: "리뷰", anchor: "seller-reviews" },
  { id: "story", label: "스토리", anchor: "seller-story" },
  { id: "inquiry", label: "문의", anchor: "seller-inquiry" },
];

type SellerProfileSectionNavProps = {
  hasFeatured?: boolean;
  hasReviews?: boolean;
  hasStory?: boolean;
};

export function SellerProfileSectionNav({
  hasFeatured = true,
  hasReviews = true,
  hasStory = true,
}: SellerProfileSectionNavProps) {
  const sections = useMemo(
    () =>
      ALL_SECTIONS.filter((section) => {
        if (section.id === "featured" && !hasFeatured) {
          return false;
        }
        if (section.id === "reviews" && !hasReviews) {
          return false;
        }
        if (section.id === "story" && !hasStory) {
          return false;
        }
        return true;
      }),
    [hasFeatured, hasReviews, hasStory],
  );

  const [active, setActive] = useState<SectionId>(sections[0]?.id ?? "products");

  const scrollTo = useCallback((sectionId: SectionId, anchor: string) => {
    setActive(sectionId);
    requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    if (sections.length === 0) {
      return;
    }

    if (!sections.some((section) => section.id === active)) {
      setActive(sections[0]!.id);
    }
  }, [active, sections]);

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
  }, [sections]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="판매자 프로필 메뉴"
      className="sticky top-12 z-20 -mx-5 border-b border-[#DDE8E2] bg-white"
    >
      <div className="flex">
        {sections.map((section) => {
          const isActive = active === section.id;

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
              {section.label}
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
