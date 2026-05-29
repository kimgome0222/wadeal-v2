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

function getScrollStep(track: HTMLDivElement): number {
  const firstItem = track.querySelector<HTMLElement>("[data-carousel-item]");
  if (!firstItem) {
    return track.clientWidth * 0.92;
  }

  const styles = getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 12;
  const itemWidth = firstItem.getBoundingClientRect().width;
  const visibleCount = Math.max(
    1,
    Math.floor((track.clientWidth + gap) / (itemWidth + gap)),
  );

  return visibleCount * (itemWidth + gap);
}

export function ProductCarousel({
  children,
  ariaLabel,
  className = "",
  scrollStep = "card",
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollPrev(track.scrollLeft > 2);
    setCanScrollNext(track.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    updateButtons();

    track.addEventListener("scroll", updateButtons, { passive: true });
    const resizeObserver = new ResizeObserver(updateButtons);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", updateButtons);
      resizeObserver.disconnect();
    };
  }, [updateButtons, children]);

  const scrollByDirection = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const firstItem = track.querySelector<HTMLElement>("[data-carousel-item]");
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 12;
    const cardStep =
      firstItem ?
        firstItem.getBoundingClientRect().width + gap
      : track.clientWidth * 0.9;
    const step = scrollStep === "page" ? getScrollStep(track) : cardStep;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
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

      <div
        className="celloh-product-carousel-track no-scrollbar snap-x snap-mandatory"
        ref={trackRef}
        role="list"
      >
        {children}
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
