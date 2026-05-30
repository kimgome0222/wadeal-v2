"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ProductCarouselProps = {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
  /** card: 카드 1장 · page: 보이는 영역만큼 */
  scrollStep?: "card" | "page";
};

function getScrollStep(scrollEl: HTMLDivElement): number {
  const track = scrollEl.querySelector<HTMLElement>("[data-rail-track]");
  if (!track) {
    return scrollEl.clientWidth * 0.92;
  }

  const firstItem = track.querySelector<HTMLElement>("[data-rail-item]");
  if (!firstItem) {
    return scrollEl.clientWidth * 0.92;
  }

  const styles = getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 12;
  const itemWidth = firstItem.getBoundingClientRect().width;
  const visibleCount = Math.max(
    1,
    Math.floor((scrollEl.clientWidth + gap) / (itemWidth + gap)),
  );

  return visibleCount * (itemWidth + gap);
}

export function ProductCarousel({
  children,
  ariaLabel,
  className = "",
  scrollStep = "card",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateButtons = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) {
      return;
    }

    const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
    setCanScrollPrev(scrollEl.scrollLeft > 2);
    setCanScrollNext(scrollEl.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) {
      return;
    }

    updateButtons();

    scrollEl.addEventListener("scroll", updateButtons, { passive: true });
    const resizeObserver = new ResizeObserver(updateButtons);
    resizeObserver.observe(scrollEl);

    return () => {
      scrollEl.removeEventListener("scroll", updateButtons);
      resizeObserver.disconnect();
    };
  }, [updateButtons, children]);

  const scrollByDirection = (direction: -1 | 1) => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) {
      return;
    }

    const track = scrollEl.querySelector<HTMLElement>("[data-rail-track]");
    const firstItem = track?.querySelector<HTMLElement>("[data-rail-item]");
    const styles = track ? getComputedStyle(track) : null;
    const gap = styles ? Number.parseFloat(styles.columnGap || styles.gap || "0") || 12 : 12;
    const cardStep =
      firstItem ?
        firstItem.getBoundingClientRect().width + gap
      : scrollEl.clientWidth * 0.9;
    const step = scrollStep === "page" ? getScrollStep(scrollEl) : cardStep;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    scrollEl.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className={`celloh-product-carousel relative ${className}`.trim()}>
      <button
        aria-label={`${ariaLabel} 이전`}
        className={`celloh-carousel-btn celloh-carousel-btn--prev ${
          canScrollPrev ? "" : "celloh-carousel-btn--disabled"
        }`.trim()}
        disabled={!canScrollPrev}
        onClick={() => scrollByDirection(-1)}
        type="button"
      >
        <span aria-hidden>‹</span>
      </button>

      <div className="celloh-product-rail-scroll no-scrollbar" ref={scrollRef}>
        <div
          aria-label={ariaLabel}
          className="celloh-product-rail-track"
          data-rail-track
          role="list"
        >
          {children}
        </div>
      </div>

      <button
        aria-label={`${ariaLabel} 다음`}
        className={`celloh-carousel-btn celloh-carousel-btn--next ${
          canScrollNext ? "" : "celloh-carousel-btn--disabled"
        }`.trim()}
        disabled={!canScrollNext}
        onClick={() => scrollByDirection(1)}
        type="button"
      >
        <span aria-hidden>›</span>
      </button>
    </div>
  );
}
