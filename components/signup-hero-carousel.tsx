"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";

import {
  SIGNUP_HERO_AUTO_MS_DESKTOP,
  SIGNUP_HERO_SLIDES,
  SIGNUP_HERO_TRANSITION_MS,
} from "@/lib/signup/hero-carousel-slides";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useMinWidthMediaQuery(minWidthPx: number) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidthPx}px)`);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [minWidthPx]);

  return matches;
}

export function SignupHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const slideCount = SIGNUP_HERO_SLIDES.length;
  const isDesktop = useMinWidthMediaQuery(768);
  const prefersReducedMotion = usePrefersReducedMotion();

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) {
        return;
      }
      setActiveIndex((index + slideCount) % slideCount);
    },
    [slideCount],
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (!isDesktop || paused || prefersReducedMotion || slideCount <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, SIGNUP_HERO_AUTO_MS_DESKTOP);

    return () => window.clearInterval(timer);
  }, [isDesktop, paused, prefersReducedMotion, slideCount]);

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;

    if (startX == null || endX == null) {
      return;
    }

    const delta = endX - startX;
    if (Math.abs(delta) < 40) {
      return;
    }

    if (delta < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  return (
    <section
      aria-label="celloh 소개 배너"
      aria-roledescription="carousel"
      className="signup-hero-carousel group relative w-full overflow-hidden rounded-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative aspect-[2.15/1] w-full min-h-[148px] max-h-[200px] sm:min-h-[168px]"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        {SIGNUP_HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          const isLight = slide.id === "seller" || slide.id === "review";
          const textPrimary = isLight ? "text-wadeal-ink" : "text-white";
          const textMuted = isLight ? "text-wadeal-muted" : "text-white/85";

          return (
            <Link
              aria-hidden={!isActive}
              className={`signup-hero-carousel__slide absolute inset-0 flex flex-col justify-end px-4 pb-9 pt-4 sm:px-5 sm:pb-10 ${
                isActive ?
                  "signup-hero-carousel__slide--active z-10 pointer-events-auto"
                : "signup-hero-carousel__slide--inactive z-0 pointer-events-none"
              }`}
              href={slide.href}
              key={slide.id}
              style={{
                background: slide.background,
                transitionDuration: `${SIGNUP_HERO_TRANSITION_MS}ms`,
              }}
              tabIndex={isActive ? 0 : -1}
            >
              <p
                className={`text-[10px] font-medium tracking-[0.08em] ${textMuted}`}
                style={{ color: isLight ? undefined : slide.accentColor }}
              >
                {slide.eyebrow}
              </p>
              <h2
                className={`mt-1.5 max-w-[16rem] text-[15px] font-semibold leading-snug tracking-[-0.02em] sm:max-w-none sm:text-base ${textPrimary}`}
              >
                {slide.title}
              </h2>
              <p className={`mt-1 max-w-[18rem] text-[12px] font-normal leading-relaxed sm:text-[13px] ${textMuted}`}>
                {slide.description}
              </p>
              <span
                className={`mt-3 inline-flex h-8 w-fit items-center rounded-lg px-3 text-[12px] font-medium ${
                  isLight ?
                    "bg-[#2E5E4E] text-white"
                  : "bg-white/95 text-[#2E5E4E]"
                }`}
              >
                {slide.cta}
              </span>
            </Link>
          );
        })}
      </div>

      {slideCount > 1 ?
        <>
          <button
            aria-label="이전 배너"
            className="signup-hero-carousel__arrow signup-hero-carousel__arrow--prev hidden md:flex"
            onClick={(event) => {
              event.preventDefault();
              goPrev();
            }}
            type="button"
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            aria-label="다음 배너"
            className="signup-hero-carousel__arrow signup-hero-carousel__arrow--next hidden md:flex"
            onClick={(event) => {
              event.preventDefault();
              goNext();
            }}
            type="button"
          >
            <span aria-hidden>›</span>
          </button>

          <div
            aria-label="배너 페이지"
            className="absolute bottom-2.5 left-0 right-0 z-20 flex justify-center"
            role="tablist"
          >
            <div className="flex gap-1.5 rounded-full bg-black/10 px-2 py-1 backdrop-blur-[2px]">
              {SIGNUP_HERO_SLIDES.map((slide, index) => (
                <button
                  aria-label={`${slide.eyebrow} 배너`}
                  aria-selected={index === activeIndex}
                  className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                    index === activeIndex ?
                      "w-4 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                  }`}
                  key={slide.id}
                  onClick={() => goTo(index)}
                  role="tab"
                  type="button"
                />
              ))}
            </div>
          </div>
        </>
      : null}
    </section>
  );
}
