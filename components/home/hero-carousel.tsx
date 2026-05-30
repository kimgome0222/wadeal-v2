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
  HOME_HERO_AUTO_MS,
  HOME_HERO_SLIDES,
  HOME_HERO_TRANSITION_MS,
} from "@/lib/home/hero-carousel-slides";

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

export function HomeHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const slideCount = HOME_HERO_SLIDES.length;
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
    if (paused || prefersReducedMotion || slideCount <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, HOME_HERO_AUTO_MS);

    return () => window.clearInterval(timer);
  }, [paused, prefersReducedMotion, slideCount]);

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
    setPaused(true);
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    setPaused(false);

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
      aria-label="celloh 메인 배너"
      aria-roledescription="carousel"
      className="home-hero-carousel group relative min-w-0 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative min-h-[220px] max-h-[260px] h-[240px] w-full overflow-hidden rounded-[24px]"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        {HOME_HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              aria-hidden={!isActive}
              className={`home-hero-carousel__slide absolute inset-0 flex flex-col justify-end px-5 pb-11 pt-5 ${
                isActive ?
                  "home-hero-carousel__slide--active z-10"
                : "home-hero-carousel__slide--inactive z-0 pointer-events-none"
              }`}
              key={slide.id}
              style={{
                backgroundColor: slide.backgroundColor,
                transitionDuration: `${HOME_HERO_TRANSITION_MS}ms`,
              }}
            >
              {slide.imageUrl ?
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                />
              : null}

              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/[0.06] blur-2xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-black/[0.08] blur-2xl"
              />

              <div className="relative z-10 min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/70">
                  {slide.eyebrow}
                </p>
                <h2 className="mt-2 max-w-[18rem] text-[21px] font-semibold leading-[1.35] tracking-[-0.02em] text-white sm:max-w-none sm:text-[22px]">
                  {slide.title}
                </h2>
                <p className="mt-2 max-w-[20rem] whitespace-pre-line text-[13px] font-normal leading-[1.6] text-white/85 sm:text-[14px]">
                  {slide.description}
                </p>
                <Link
                  className="celloh-transition mt-4 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-[#2E5E4E] hover:bg-white/95 active:scale-[0.97]"
                  href={slide.href}
                  tabIndex={isActive ? 0 : -1}
                >
                  {slide.cta}
                </Link>
              </div>
            </article>
          );
        })}

        <div
          aria-label="배너 페이지"
          className="absolute bottom-3.5 left-0 right-0 z-20 flex justify-center"
          role="tablist"
        >
          <div className="flex gap-1.5">
            {HOME_HERO_SLIDES.map((slide, index) => (
              <button
                aria-label={`${slide.eyebrow} 배너`}
                aria-selected={index === activeIndex}
                className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                  index === activeIndex ?
                    "w-4 bg-white"
                  : "w-1.5 bg-white/45 hover:bg-white/70"
                }`}
                key={slide.id}
                onClick={() => goTo(index)}
                role="tab"
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
