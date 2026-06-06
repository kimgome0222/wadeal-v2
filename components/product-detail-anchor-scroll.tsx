"use client";

import { useEffect } from "react";

/** #product-reviews · #product-qna 등 딥링크 스크롤 (탭 없이 섹션 앵커) */
export function ProductDetailAnchorScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) {
      return;
    }

    requestAnimationFrame(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return null;
}
